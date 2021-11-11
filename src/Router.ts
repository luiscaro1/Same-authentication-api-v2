import express from "express";
import { find } from "lodash";
import Injectable from "@/Decorators/Injectable";

@Injectable("router")
class Router {
  public router: express.Router;

  public providers: { [key: string]: { new (): void } } = {};

  constructor() {
    this.router = express.Router();
  }

  public resolve(token: string): any {
    const matchedProvider = find(
      this.providers,
      (_provider: any, key: any) => key === token
    );

    if (matchedProvider) return matchedProvider;
    throw new Error(`No provider found for ${token}`);
  }
}

export default Router;
