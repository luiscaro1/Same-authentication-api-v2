import express from "express";
import passport from "passport";
import Injectable from "@/Decorators/Injectable";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import AuthDAO from "../Daos/auth";

interface Account {
  uid: string;
  user_name: string;
  avatar_url: string;
}

interface Info {
  token: string;
  accountInfo: Account;
  maxAge: number;
}

const createUserCookie = (req: express.Request, res: express.Response) => {
  const { token, accountInfo, maxAge } = req.user as Info;
  console.log(maxAge);

  res.cookie("same", token, {
    sameSite: "none",
    secure: true,
    maxAge: maxAge * 1000,
  });

  res.json(accountInfo);
};

const authenticate = function (
  req: express.Request,
  res: express.Response,
  next: express.NextFunction
) {
  passport.authenticate(
    "local",

    (err1, user, info) => {
      if (err1) {
        return next(err1);
      }
      if (!user) {
        return res.status(400).send(info);
      }
      req.logIn(user, { session: false }, (err2) => {
        if (err2) {
          return next(err2);
        }
        req.user = user;
        createUserCookie(req, res);
      });
    }
  )(req, res, next);
};

@Injectable("authController")
class AuthController {
  @Inject("authDAO") public static authDAO: AuthDAO;

  // TODO: Handle media messages with media server
  @route("POST", authenticate, "login")
  public static async login(): Promise<void> {
    console.log("login");
  }

  @route(
    "POST",
    async (
      req: express.Request,
      res: express.Response,
      next: express.NextFunction
    ) => {
      try {
        await AuthController.authDAO.createAccount(req.body as any);
        next();
      } catch (err) {
        res
          .status(400)
          .send({ message: "An error occured, please try again later!" });
      }
    },
    authenticate,
    "signup"
  )
  public static async signup(): Promise<void> {
    console.log("signup");
  }

  @route(
    "GET",
    passport.authenticate("jwt", { session: false }),
    (req: express.Request, res: express.Response) => {
      if (req.user) res.json(req.user);
      else
        res.status(400).send({ message: "unable to retreive account info!" });
    },
    "verify"
  )
  public static async verify(): Promise<void> {
    console.log("verify");
  }
}

export default AuthController;
