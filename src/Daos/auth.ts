/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";

interface AccountBody {
  user_name: string;
  password: string;
  email: string;
  first_name: string;
  last_name: string;
}

// interface UserBody{
//   uid:string,
//   is_active:boolean;
// }

interface ModUser {
  uid: string;
  user_name: string;
  password: string;
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

  public async deleteAccount(uid: string) {
    const db = await this.dbContext.db;
    const query = `update "User" set is_active=false where uid='${uid}' returning *`;
    const user = (await db.raw(query)).rows[0];
    return user;
  }

  public async getAccountByUsername(user_name: string) {
    const db = await this.dbContext.db;
    const query = `select * from "User" where user_name='${user_name}' and is_active=true`;
    const user = (await db.raw(query)).rows[0];
    return user;
  }

  public async updateAccount({ user_name, password, uid }: ModUser) {
    const db = await this.dbContext.db;
    const hp = await bcrypt.hash(password, 10);
    const query = `update "User" set user_name='${user_name}', password='${hp}'where uid='${uid}' returning *`;
    const user = (await db.raw(query)).rows[0];
    return user;
  }
}

export default AuthDAO;
