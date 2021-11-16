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

// interface ModInfo{
//   uid:string;
//   user_name:string;
//   password:string;
// }

const createUserCookie = (req: express.Request, res: express.Response) => {
  const { token, accountInfo, maxAge } = req.user as Info;

  // res.cookie("same", token, {
  //   sameSite: "none",
  //   secure: true,
  //   httpOnly: true,
  //   maxAge: maxAge * 1000,
  // });

  res.json({ accountInfo, token });
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
    "POST",
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

  // THIS WORKSSSSSS
  @route("DELETE", ":id")
  public static async deleteAccount(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      await AuthController.authDAO.deleteAccount(req.params.id as any);
      res.status(200).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  // THis works but needs to be modify for the dashboard , must add bio to user table
  @route("GET", ":user_name")
  public static async getAccountByUsername(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const result = await AuthController.authDAO.getAccountByUsername(
        req.params.user_name as any
      );
      res.json(result).status(200).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  // Works but needs to be modified so you dont need to write the uid
  @route("PUT", "update")
  public static async updateAccount(
    req: express.Request,
    res: express.Response
  ) {
    // const id=parseInt(req.params.id)
    // const {uid,user_name,password } = req.body as ModInfo
    try {
      const result = await AuthController.authDAO.updateAccount(
        req.body as any
      );
      res.json(result).status(200).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default AuthController;
