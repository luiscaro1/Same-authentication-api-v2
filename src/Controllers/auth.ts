import express from "express";
import Injectable from "@/Decorators/Injectable";
import passport from "passport";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import AuthDAO from "../Daos/auth";
import session from "express-session";

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
    httpOnly: true,
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

    function (err, user, info) {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(400).send(info);
      }
      req.logIn(user, { session: false }, function (err) {
        if (err) {
          return next(err);
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
  public static async login(
    req: express.Request,
    res: express.Response
  ): Promise<void> {}

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
  public static async signup(
    req: express.Request,
    res: express.Response
  ): Promise<void> {}

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
  public static async verify(
    req: express.Request,
    res: express.Response
  ): Promise<void> {}
}

export default AuthController;
