/* eslint-disable camelcase */
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";
import bcrypt from "bcryptjs";

interface AccountBody {
  user_name: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

@Injectable("authDAO")
class AuthDAO {
  @Inject("dbContext") public dbContext!: DbContext;

  public async getAccountByFilter(fieldname: string, value: string) {
    const db = await this.dbContext.db;

    const query = `select * from "User" as U where U.${fieldname} = '${value}'`;

    // console.log(query);

    const user = (await db.raw(query)).rows[0];

    return user;
  }

  public async createAccount({
    user_name,
    email,
    password,
    first_name,
    last_name,
  }: AccountBody) {
    const db = await this.dbContext.db;
    const hp = await bcrypt.hash(password, 10);

    const user = await db
      .insert({
        user_name,
        email,
        password: hp,
        first_name,
        last_name,
      })
      .into("User")
      .returning("*");

    return user;
  }
}

export default AuthDAO;
