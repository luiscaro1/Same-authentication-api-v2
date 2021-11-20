/* eslint-disable camelcase */
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";

interface BlockBody {
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

  public async getallblocked({ uid }: BlockBody): Promise<Array<BlockBody>> {
    const gab = (
      await this.dbContext.db.raw(`select * from "Block"
        where uid='${uid}' and is_blocked=true`)
    ).rows;

    return gab;
  }

  public async getallblockedby({ uid }: BlockBody): Promise<Array<BlockBody>> {
    const gab = (
      await this.dbContext.db.raw(`select * from "Block"
        where uid2='${uid}' and is_blocked=true`)
    ).rows;

    return gab;
  }

  public async unfriend({ uid, uid2 }: BlockBody) {
    const unfriend = (
      await this.dbContext.db.raw(`update "Friends" set is_friend = false 
        where uid ='${uid}' and uid2 = '${uid2}' and is_friend=True
        or uid ='${uid2}' and uid2 ='${uid}' and is_friend=True
        returning *`)
    ).rows[0];

    return unfriend;
  }

  public async checkifblock({ uid, uid2 }: BlockBody) {
    const check = (
      await this.dbContext.db.raw(`select is_blocked from "Block"
      where uid='${uid}' and uid2='${uid2}'`)
    ).rows;

    if (check[0]) {
      return check[0]?.is_blocked;
    }

    return null;
  }

  public async checkifunblock({ uid, uid2 }: BlockBody) {
    const check = (
      await this.dbContext.db.raw(`select is_blocked from "Block"
      where uid='${uid}' and uid2='${uid2}'`)
    ).rows;

    if (check[0]) {
      return check[0]?.is_blocked;
    }

    return null;
  }

  public async reblock({ uid, uid2 }: BlockBody) {
    const reblock = (
      await this.dbContext.db.raw(`update "Block" set is_blocked = true 
        where uid ='${uid}' and uid2 = '${uid2}' and is_blocked=false
        returning *`)
    ).rows[0];

    return reblock;
  }
}

export default BlockDAO;
