import passport from "passport";
import { Strategy } from "passport-jwt";
import jwt from "jsonwebtoken";
import AuthDAO from "@/Daos/auth";
import Injectable from "@/Decorators/Injectable";
import Inject from "@/Decorators/Inject";

@Injectable("jWTStrategy")
class JWTStrategy {
  @Inject("authDAO") public static authDAO: AuthDAO;

  // extract token from cookie
  public static cookieExtractor = (req: any) => {
    let token = null;
    if (req && req.body) {
      token = req.body.cookie;
    }
    return token;
  };

  // authenticate with a JWT
  public static useJWTStrategy = () => {
    passport.use(
      new Strategy(
        {
          jwtFromRequest: JWTStrategy.cookieExtractor,
          secretOrKey: process.env.SECRET,
        },
        async (jwtPayload: any, done: any) => {
          try {
            const user = await JWTStrategy.authDAO.getAccountByFilter(
              "uid",
              jwtPayload.id
            );
            const { avatar_url, user_name, uid } = user;
            if (user) {
              return done(null, { avatar_url, user_name, uid });
            }
            return done(null, false);
          } catch (err) {
            done(err, false);
          }
        }
      )
    );
  };
}

export default JWTStrategy;
