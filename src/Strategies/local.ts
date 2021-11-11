import passport from "passport";
import { Strategy } from "passport-local";

import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Injectable from "@/Decorators/Injectable";
import Inject from "@/Decorators/Inject";
import AuthDAO from "@/Daos/auth";
import http from "http";

// age of the token
const maxAge: number = 3 * 24 * 60 * 60;

// this creates a JWT
@Injectable("localStrategy")
class LocalStrategy {
  @Inject("authDAO") public static authDAO: AuthDAO;
  // authenitcates user with email and password
  public static useLocalStrategy(): void {
    passport.use(
      new Strategy(
        {
          usernameField: "user_name",
          passwordField: "password",
        },
        async (user_name: string, password: string, done) => {
          const user = await LocalStrategy.authDAO.getAccountByFilter(
            "user_name",
            user_name
          );

          try {
            // check if the user exsits
            if (!user)
              return done(null, false, {
                message: "User doesn't exist.",
              });

            // verifies if the password is correct

            if (await bcrypt.compare(password, user.password)) {
              const token = jwt.sign(
                { id: user.uid },
                process.env.SECRET as string,
                {
                  expiresIn: maxAge,
                }
              );
              const { user_name, uid, avatar_url } = user;
              return done(null, {
                accountInfo: { user_name, uid, avatar_url },
                token,
                maxAge,
              });
            }
            return done(null, false, { message: "Incorrect password!" });
          } catch (err) {
            return done(err);
          }
        }
      )
    );
  }
}

export default LocalStrategy;
