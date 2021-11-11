import fs from "fs";
import path from "path";
import { FunctionBase } from "lodash";

interface LooseObject {
  [key: string]: FunctionBase;
}

const api: LooseObject = {};

if (process.env.BUILD === "WEBPACK") {
  const requireModule = require.context("@/Controllers", false, /\.ts$/);

  requireModule.keys().forEach((fileName) => {
    if (fileName === "./InstantiateControllers.ts") return;
    const moduleName = fileName.replace(/(\.\/|\.ts)/g, "");
    api[moduleName] = {
      ...requireModule(fileName).default,
    };
  });
} else {
  fs.readdirSync("./src/controllers").forEach((file) => {
    const moduleName = file.replace(/(\.\/|\.ts)/g, "");

    import(path.join("@/controllers", file)).then((m) => {
      if (file === "InstantiateControllers.ts") return;
      api[moduleName] = {
        ...m.default,
      };
    });
  });
}

export default api;
