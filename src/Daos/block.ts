/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import { stringify } from "qs";
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";

interface BlockBody {
  uid: string;
  uid2: string;
}

interface id {
  uid: string;
}

interface GAB {
  // get all blocked
  bid: string;
  uid: string;
  uid2: string;
  is_blocked: boolean;
}

@Injectable("blockDAO")
class BlockDAO {
  @Inject("dbContext") public dbContext!: DbContext;

  public async blockuser({ uid, uid2 }: BlockBody) {
    const is_blocked = true;
    const db = await this.dbContext.db;
    const block = await db
      .insert({
        uid,
        uid2,
        is_blocked,
      })
      .into("Block")
      .returning("*");

    return block;
  }

  public async unblock({ uid, uid2 }: BlockBody) {
    const unblock = (
      await this.dbContext.db.raw(`update "Block" set is_blocked = false 
        where uid ='${uid}' and uid2 = '${uid2}' and is_blocked=True
        returning *`)
    ).rows[0];

    return unblock;
  }

  public async getallblocked({ uid }: id): Promise<Array<GAB>> {
    const gab = (
      await this.dbContext.db.raw(`select * from "Block"
        where uid='${uid}' and is_blocked=true`)
    ).rows;

    return gab;
  }

  public async getallblockedby({ uid }: id): Promise<Array<GAB>> {
    const gab = (
      await this.dbContext.db.raw(`select * from "Block"
        where uid2='${uid}' and is_blocked=true`)
    ).rows;

    return gab;
  }
}

export default BlockDAO;
