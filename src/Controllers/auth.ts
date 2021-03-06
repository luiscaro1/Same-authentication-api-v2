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
  const { token, accountInfo } = req.user as Info;

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
        const check = await AuthController.authDAO.createAccount(
          req.body as any
        );
        if (check === "invalid password") {
          return res
            .status(400)
            .send({
              message:
                "invalid password, password must contain: minimum 8 characers, 1 upper case letter, 1 lower case letter, a number, and a special character",
            })
            .end();
        }

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
  @route("DELETE", "delete/:id")
  public static async deleteAccount(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      await AuthController.authDAO.deleteAccount(req.params.id as any);
      res.json("Account has been deleted");
    } catch (err) {
      res.status(400).send(err);
    }
  }

  // THis works but needs to be modify for the dashboard , must add bio to user table
  @route("GET", "user/:user_name")
  public static async getAccountByUsername(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const result = await AuthController.authDAO.getAccountByUsername(
        req.params.user_name as any
      );
      res.json(result);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("PUT", "update")
  public static async updateAccount(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const result = await AuthController.authDAO.updateAccount(
        req.body as any
      );
      res.json(result);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("PUT", "update/user_name")
  public static async updateUsername(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const result = await AuthController.authDAO.updateUsername(
        req.body as any
      );
      res.json(result);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("PUT", "update/email")
  public static async updateEmail(req: express.Request, res: express.Response) {
    try {
      const result = await AuthController.authDAO.updateEmail(req.body as any);
      res.json(result);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("PUT", "update/password")
  public static async updatePassword(
    req: express.Request,
    res: express.Response
  ) {
    try {
      const result = await AuthController.authDAO.updatePassword(
        req.body as any
      );
      if (result === "invalid password") {
        return res
          .status(400)
          .send({
            message:
              "invalid password, password must contain: minimum 8 characers, 1 upper case letter, 1 lower case letter, a number, and a special character",
          })
          .end();
      }

      res.json(result);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("PUT", "update/bio")
  public static async updateBio(req: express.Request, res: express.Response) {
    try {
      const result = await AuthController.authDAO.updateBio(req.body as any);
      res.json(result).status(200).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("GET", "getemail/:user_name")
  public static async getEmail(req: express.Request, res: express.Response) {
    try {
      const result = await AuthController.authDAO.getEmail(
        req.params.user_name as any
      );
      res.json(result);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("GET", "getbio/:user_name")
  public static async getBio(req: express.Request, res: express.Response) {
    try {
      const result = await AuthController.authDAO.getBio(
        req.params.user_name as any
      );
      res.json(result).status(200).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default AuthController;
