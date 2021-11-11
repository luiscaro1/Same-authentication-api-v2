import knex, { Knex } from "knex";
import knexfile from "@/Db/Knexfile";

import Injectable from "@/Decorators/Injectable";

const { development, production } = knexfile;

@Injectable("dbContext")
class DbContext {
  public db: Knex;

  constructor() {
    console.log(process.env.NODE_ENV);
    this.db = knex(
      process.env.NODE_ENV === "production" ? production : development
    );
  }

  // TODO: insert getters and setters for the different tables
}

export default DbContext;
