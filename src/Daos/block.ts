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

  public async blockuser({ uid }: BlockBody, user_name: string) {
    const is_blocked = true;
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
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

  public async unblock({ uid }: BlockBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
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

  // used for when you block a user
  public async unfriend({ uid }: BlockBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const unfriend = (
      await this.dbContext.db.raw(`update "Friends" set is_friend = false 
        where uid ='${uid}' and uid2 = '${uid2}' and is_friend=True
        or uid ='${uid2}' and uid2 ='${uid}' and is_friend=True
        returning *`)
    ).rows[0];

    return unfriend;
  }

  public async getblockcount({ uid }: BlockBody) {
    const gbc = (
      await this.dbContext.db.raw(`select count(*)
      from "Block"
      where uid='${uid}' and is_blocked = true`)
    ).rows[0].count;

    return gbc;
  }

  // all of the middleware daos

  public async checkifblock({ uid }: BlockBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const check = (
      await this.dbContext.db.raw(`select is_blocked from "Block"
      where uid='${uid}' and uid2='${uid2}'`)
    ).rows;

    if (check[0]) {
      return check[0]?.is_blocked;
    }

    return null;
  }

  public async checkifunblock({ uid }: BlockBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const check = (
      await this.dbContext.db.raw(`select is_blocked from "Block"
      where uid='${uid}' and uid2='${uid2}'`)
    ).rows;

    if (check[0]) {
      return check[0]?.is_blocked;
    }

    return null;
  }

  public async reblock({ uid }: BlockBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const reblock = (
      await this.dbContext.db.raw(`update "Block" set is_blocked = true 
        where uid ='${uid}' and uid2 = '${uid2}' and is_blocked=false
        returning *`)
    ).rows[0];

    return reblock;
  }
}

export default BlockDAO;
