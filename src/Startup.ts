import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import passport from "passport";
import "@/Lib/Env";
import Router from "@/Router";
import "@/Controllers/InstantiateControllers";
import Inject from "@/Decorators/Inject";

import LocalStrategy from "./Strategies/local";
import JWTStrategy from "./Strategies/jwt";

class Application {
  @Inject("router") private static routehandler: Router;

  public static init(): void {
    const PORT: string | number = process.env.PORT || 5000;

    const app = express();
    // trust heroku proxy
    app.set("trust proxy", 1);
    app.use(cookieParser());

    app.use(
      cors({
        origin: process.env.CLIENT_URL,
        credentials: true,
      })
    );

    app.use(passport.initialize());

    app.use(express.json());

    app.use(express.urlencoded({ extended: true }));

    app.use(this.routehandler.router);
    console.log(this.routehandler.router);

    LocalStrategy.useLocalStrategy();
    JWTStrategy.useJWTStrategy();

    app.listen(PORT);
  }
}

Application.init();

export default Application;
