import rule from "../../src/rules/no-direct-date.js";
import { createRuleTester } from "../setup.js";

const ruleTester = createRuleTester();

ruleTester.run("no-direct-date", rule, {
  valid: [
    {
      name: "should allow dayjs",
      code: "import dayjs from 'dayjs'; const date = dayjs();",
    },
    {
      name: "should allow date-fns imports and functions",
      code: "import { format, parseISO } from 'date-fns'; format(parseISO('2024-01-01'), 'yyyy-MM-dd');",
    },
    {
      name: "should allow custom Date class",
      code: "const MyDate = class {}; new MyDate();",
    },
    {
      name: "should allow other function calls",
      code: "const timestamp = getTimestamp();",
    },
    {
      name: "should allow now method on other objects",
      code: "const obj = { now: () => 123 }; obj.now();",
    },
    {
      name: "should allow parse method on other objects",
      code: "const DateUtil = { parse: (s) => s }; DateUtil.parse('2024');",
    },
    {
      name: "should allow now on other classes",
      code: "class DateHelper { static now() { return 0; } } DateHelper.now();",
    },
    {
      name: "should allow nested Date property",
      code: "const config = { Date: { now: () => 0 } }; config.Date.now();",
    },
    {
      name: "should allow other Date static methods",
      code: "const timestamp = Date.UTC(2024, 0, 1);",
    },
  ],
  invalid: [
    {
      name: "should reject new Date()",
      code: "const date = new Date();",
      errors: [{ messageId: "noNewDate" }],
    },
    {
      name: "should reject new Date with string argument",
      code: "const date = new Date('2024-01-01');",
      errors: [{ messageId: "noNewDate" }],
    },
    {
      name: "should reject new Date with number arguments",
      code: "const date = new Date(2024, 0, 1);",
      errors: [{ messageId: "noNewDate" }],
    },
    {
      name: "should reject new Date with timestamp",
      code: "const date = new Date(1704067200000);",
      errors: [{ messageId: "noNewDate" }],
    },
    {
      name: "should reject Date.now()",
      code: "const timestamp = Date.now();",
      errors: [{ messageId: "noDateNow" }],
    },
    {
      name: "should reject Date.parse()",
      code: "const ms = Date.parse('2024-01-01');",
      errors: [{ messageId: "noDateParse" }],
    },
    {
      name: "should reject new Date inside function",
      code: "function getDate() { return new Date(); }",
      errors: [{ messageId: "noNewDate" }],
    },
    {
      name: "should reject Date.now inside arrow function",
      code: "const getTimestamp = () => Date.now();",
      errors: [{ messageId: "noDateNow" }],
    },
    {
      name: "should reject exported new Date",
      code: "export const currentDate = new Date();",
      errors: [{ messageId: "noNewDate" }],
    },
    {
      name: "should reject Date.now in condition",
      code: "if (Date.now() > deadline) {}",
      errors: [{ messageId: "noDateNow" }],
    },
    {
      name: "should reject multiple new Date in array",
      code: "const dates = [new Date(), new Date()];",
      errors: [{ messageId: "noNewDate" }, { messageId: "noNewDate" }],
    },
    {
      name: "should reject multiple Date.now calls",
      code: "const start = Date.now(); doWork(); const end = Date.now();",
      errors: [{ messageId: "noDateNow" }, { messageId: "noDateNow" }],
    },
    {
      name: "should reject new Date in method chain",
      code: "console.log(new Date().toISOString());",
      errors: [{ messageId: "noNewDate" }],
    },
    {
      name: "should reject Date.parse in expression",
      code: "const isValid = !isNaN(Date.parse(dateString));",
      errors: [{ messageId: "noDateParse" }],
    },
    {
      name: "should name the configured utility in the message",
      code: "const date = new Date();",
      options: [{ utilityName: "date-fns" }],
      errors: [{ messageId: "noNewDate", data: { utility: "date-fns" } }],
    },
  ],
});
