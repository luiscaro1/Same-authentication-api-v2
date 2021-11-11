import { FunctionBase } from "lodash";
import ServiceContainer from "@/ServiceContainer";

export default function Inject(token: string): FunctionBase {
  return function (target: FunctionConstructor, key: string) {
    Object.defineProperty(target, key, {
      get: () => ServiceContainer.resolve(token),
      enumerable: true,
      configurable: true,
    });
  };
}
