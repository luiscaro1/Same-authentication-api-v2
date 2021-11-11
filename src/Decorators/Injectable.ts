import { FunctionBase } from "lodash";
import ServiceContainer from "@/ServiceContainer";

export default function Injectable(token: string): FunctionBase {
  return function (Target: FunctionConstructor): void {
    ServiceContainer.providers[token] = new Target();
  };
}
