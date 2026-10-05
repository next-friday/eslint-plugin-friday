import {execFileSync} from "node:child_process";
import console from "node:console";
import {readFileSync} from "node:fs";
import path from "node:path";
import process from "node:process";

const DEFAULT_COMPARE_BRANCH = "origin/main";
const DEFAULT_FAIL_UNDER = 95;

function parseArguments(arguments_) {
  const coverageFiles = [];
  let compareBranch = DEFAULT_COMPARE_BRANCH;
  let failUnder = DEFAULT_FAIL_UNDER;

  for (let index = 0; index < arguments_.length; index += 1) {
    const argument = arguments_[index];

    if (argument === "--compare-branch") {
      compareBranch = arguments_[index + 1] ?? compareBranch;
      index += 1;
      continue;
    }

    if (argument === "--fail-under") {
      failUnder = Number(arguments_[index + 1] ?? failUnder);
      index += 1;
      continue;
    }

    coverageFiles.push(argument);
  }

  if (coverageFiles.length === 0) {
    throw new Error("At least one LCOV file is required.");
  }

  if (!Number.isFinite(failUnder) || failUnder < 0 || failUnder > 100) {
    throw new Error("--fail-under must be a number between 0 and 100.");
  }

  return {compareBranch, coverageFiles, failUnder};
}

function normalizeSourcePath(sourcePath) {
  const root = process.cwd();
  const absolute = path.resolve(sourcePath);

  return path.relative(root, absolute).replaceAll("\\", "/");
}

function mergeCoverage(target, source) {
  for (const [line, hits] of source.lines) {
    target.lines.set(line, (target.lines.get(line) ?? 0) + hits);
  }

  for (const [line, hasUncoveredBranch] of source.branches) {
    target.branches.set(line, (target.branches.get(line) ?? false) || hasUncoveredBranch);
  }
}

function parseLcov(filePath) {
  const reports = new Map();
  let current;

  for (const rawLine of readFileSync(filePath, "utf8").split(/\r?\n/u)) {
    if (rawLine.startsWith("SF:")) {
      const sourcePath = normalizeSourcePath(rawLine.slice(3));
      current = reports.get(sourcePath) ?? {branches: new Map(), lines: new Map()};
      reports.set(sourcePath, current);
      continue;
    }

    if (current === undefined) {
      continue;
    }

    if (rawLine.startsWith("DA:")) {
      const [lineText, hitsText] = rawLine.slice(3).split(",", 2);
      const line = Number(lineText);
      const hits = Number(hitsText);

      if (Number.isSafeInteger(line) && Number.isFinite(hits)) {
        current.lines.set(line, (current.lines.get(line) ?? 0) + hits);
      }

      continue;
    }

    if (!rawLine.startsWith("BRDA:")) {
      continue;
    }

    const branchData = rawLine.slice(5).split(",", 4);
    const line = Number(branchData[0]);

    if (!Number.isSafeInteger(line)) {
      continue;
    }

    const taken = branchData[3];
    const hasUncoveredBranch = taken === "-" || Number(taken) === 0;

    current.branches.set(line, (current.branches.get(line) ?? false) || hasUncoveredBranch);
  }

  return reports;
}

function loadCoverage(coverageFiles) {
  const coverage = new Map();

  for (const filePath of coverageFiles) {
    for (const [sourcePath, report] of parseLcov(filePath)) {
      const target = coverage.get(sourcePath) ?? {branches: new Map(), lines: new Map()};
      mergeCoverage(target, report);
      coverage.set(sourcePath, target);
    }
  }

  return coverage;
}

function parseChangedLines(compareBranch, sourcePaths) {
  const diff = execFileSync(
    "git",
    ["diff", "--unified=0", `${compareBranch}...HEAD`, "--", ...sourcePaths],
    {
      encoding: "utf8",
      maxBuffer: 64 * 1024 * 1024,
    },
  );
  const changedLines = new Map();
  let currentPath;

  for (const line of diff.split(/\r?\n/u)) {
    if (line.startsWith("+++ b/")) {
      currentPath = line.slice(6);
      changedLines.set(currentPath, changedLines.get(currentPath) ?? new Set());
      continue;
    }

    if (currentPath === undefined || !line.startsWith("@@")) {
      continue;
    }

    const match = /\+(\d+)(?:,(\d+))?/u.exec(line);

    if (match === null) {
      continue;
    }

    const start = Number(match[1]);
    const count = Number(match[2] ?? "1");
    const lines = changedLines.get(currentPath);

    for (let offset = 0; offset < count; offset += 1) {
      lines?.add(start + offset);
    }
  }

  return changedLines;
}

function classifyLine(report, line) {
  const hits = report.lines.get(line);
  const branches = report.branches.get(line);

  if (hits === undefined) {
    if (branches === undefined) {
      return;
    }

    return branches ? "partial" : "hit";
  }

  if (hits === 0) {
    return "miss";
  }

  return branches === true ? "partial" : "hit";
}

function calculatePatchCoverage(coverage, changedLines) {
  const files = [];
  let hits = 0;
  let misses = 0;
  let partials = 0;

  for (const [sourcePath, report] of coverage) {
    const changed = changedLines.get(sourcePath);

    if (changed === undefined) {
      continue;
    }

    const result = {hits: 0, misses: 0, partials: 0};

    for (const line of changed) {
      const classification = classifyLine(report, line);

      if (classification === undefined) {
        continue;
      }

      if (classification === "hit") {
        result.hits += 1;
      } else if (classification === "partial") {
        result.partials += 1;
      } else {
        result.misses += 1;
      }
    }

    const total = result.hits + result.partials + result.misses;

    if (total === 0) {
      continue;
    }

    hits += result.hits;
    partials += result.partials;
    misses += result.misses;
    files.push({sourcePath, ...result, total});
  }

  return {files, hits, misses, partials};
}

function percentage(hits, total) {
  return total === 0 ? 100 : (hits / total) * 100;
}

const {compareBranch, coverageFiles, failUnder} = parseArguments(process.argv.slice(2));
const coverage = loadCoverage(coverageFiles);
const changedLines = parseChangedLines(compareBranch, coverage.keys());
const result = calculatePatchCoverage(coverage, changedLines);
const total = result.hits + result.partials + result.misses;
const patchCoverage = percentage(result.hits, total);

console.log("-------------");
console.log("Codecov-compatible Patch Coverage");
console.log(`Diff: ${compareBranch}...HEAD`);
console.log("-------------");

for (const file of result.files) {
  const fileCoverage = percentage(file.hits, file.total).toFixed(5);
  console.log(
    `${file.sourcePath}: ${fileCoverage}% (${file.misses} misses, ${file.partials} partials)`,
  );
}

console.log("-------------");
console.log(`Hits: ${result.hits}`);
console.log(`Partials: ${result.partials}`);
console.log(`Misses: ${result.misses}`);
console.log(`Total: ${total}`);
console.log(`Coverage: ${patchCoverage.toFixed(5)}%`);
console.log(`Required: ${failUnder.toFixed(2)}%`);
console.log("-------------");

if (patchCoverage < failUnder) {
  console.error(
    `Patch coverage ${patchCoverage.toFixed(5)}% is below the required ${failUnder.toFixed(2)}%.`,
  );
  process.exitCode = 1;
}
