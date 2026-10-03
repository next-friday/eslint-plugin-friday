import packageJson from "../package.json" with {type: "json"};

export const meta = {
  name: packageJson.name,
  namespace: "friday",
  version: packageJson.version,
};
