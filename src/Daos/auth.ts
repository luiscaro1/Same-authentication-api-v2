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
  is_active: boolean;
  bio: string;
}

interface ModUser {
  uid: string;
  user_name: string;
  password: string;
  email: string;
  bio: string;
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
    const is_active = true;
    const bio = "Welcome to Same. You can customize your bio in settings.";
    const db = await this.dbContext.db;
    // test for password
    const ctsc = /[^A-Za-z0-9]/; // used to check for special characters
    const ctu = /[A-Z]/; // used to check for uppercase letter
    const ctl = /[a-z]/; // used to check for lowercase letter
    const ctn = /[0-9]/; // used to check for numbers
    if (
      password.length > 7 &&
      ctsc.test(password) &&
      ctu.test(password) &&
      ctl.test(password) &&
      ctn.test(password)
    ) {
      const hp = await bcrypt.hash(password, 10);
      const user = await db
        .insert({
          user_name,
          email,
          password: hp,
          first_name,
          last_name,
          is_active,
          bio,
        })
        .into("User")
        .returning("*");

      return user;
    }

    return "invalid password";
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

  public async updateUsername({ uid, user_name }: ModUser) {
    const db = await this.dbContext.db;
    const query = `update "User" set user_name='${user_name}' where uid='${uid}' returning user_name`;
    const name = (await db.raw(query)).rows[0].user_name;
    return name;
  }

  public async updateEmail({ uid, email }: ModUser) {
    const db = await this.dbContext.db;
    const query = `update "User" set email='${email}' where uid='${uid}' returning email`;
    const result = (await db.raw(query)).rows[0].email;
    return result;
  }

  public async updatePassword({ uid, password }: ModUser) {
    const ctsc = /[^A-Za-z0-9]/; // used to check for special characters
    const ctu = /[A-Z]/; // used to check for uppercase letter
    const ctl = /[a-z]/; // used to check for lowercase letter
    const ctn = /[0-9]/; // used to check for numbers
    if (
      password.length > 7 &&
      ctsc.test(password) &&
      ctu.test(password) &&
      ctl.test(password) &&
      ctn.test(password)
    ) {
      const db = await this.dbContext.db;
      const hp = await bcrypt.hash(password, 10);
      const query = `update "User" set password='${hp}'where uid='${uid}'`;
      const new_password = (await db.raw(query)).rows[0];
      return "Password change successful";
    }

    return "invalid password";
  }

  // for when bio is added
  public async updateBio({ uid, bio }: ModUser) {
    const db = await this.dbContext.db;
    const query = `update "User" set bio='${bio}' where uid='${uid}' returning bio`;
    const result = (await db.raw(query)).rows[0].bio;
    return result;
  }

  // for settings
  public async getEmail(user_name: string) {
    const db = await this.dbContext.db;
    const query = `select email from "User" where user_name='${user_name}' and is_active=true`;
    const { email } = (await db.raw(query)).rows[0];
    return email;
  }

  public async getBio(user_name: string) {
    const db = await this.dbContext.db;
    const query = `select bio from "User" where user_name='${user_name}' and is_active=true`;
    const { bio } = (await db.raw(query)).rows[0];
    return bio;
  }
}

export default AuthDAO;
