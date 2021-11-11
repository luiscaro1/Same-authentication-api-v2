import { find, FunctionBase } from "lodash";

class ServiceContainer {
  public providers: { [key: string]: FunctionBase } = {};

  public resolve(token: string) {
    const matchedProvider = find(
      this.providers,
      (_provider: FunctionBase, key: string) => key === token
    );

    if (matchedProvider) return matchedProvider;
    throw new Error(`No provider found for ${token}`);
  }
}

export default new ServiceContainer();
