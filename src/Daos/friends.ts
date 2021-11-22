/* eslint-disable camelcase */
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";

interface FriendsBody {
  fid: string;
  uid: string;
  uid2: string;
  is_friend: boolean;
}
interface BlockBody {
  fid: string;
  uid: string;
  uid2: string;
  is_blocked: boolean;
}

@Injectable("friendsDAO")
class FriendsDAO {
  @Inject("dbContext") public dbContext!: DbContext;

  public async addFriends({ uid }: FriendsBody, user_name: string) {
    const is_friend = true;
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const db = await this.dbContext.db;
    const friend = await db
      .insert({
        uid,
        uid2,
        is_friend,
      })
      .into("Friends")
      .returning("*");

    return friend;
  }

  public async unfriend({ uid }: FriendsBody, user_name: string) {
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

  public async getallfriends({
    uid,
  }: FriendsBody): Promise<Array<FriendsBody>> {
    const gaf = (
      await this.dbContext.db.raw(`select * from "Friends"
        where uid='${uid}' or uid2='${uid}' and is_friend=true`)
    ).rows;

    return gaf;
  }

  // all of the middleware daos

  public async checkiffriends({ uid }: FriendsBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const check = (
      await this.dbContext.db.raw(`select is_friend from "Friends"
      where uid='${uid}' and uid2='${uid2}'
      or uid='${uid2}' and uid2='${uid}'`)
    ).rows;

    if (check[0]) {
      return check[0]?.is_friend;
    }

    return null;
  }

  public async checkifnotfriends({ uid }: FriendsBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const check = (
      await this.dbContext.db.raw(`select is_friend from "Friends"
      where uid='${uid}' and uid2='${uid2}'
      or uid='${uid2}' and uid2='${uid}'`)
    ).rows;

    if (check[0]) {
      return check[0]?.is_friend;
    }

    return null;
  }

  public async refriend({ uid }: FriendsBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const refriend = (
      await this.dbContext.db.raw(`update "Friends" set is_friend = true 
        where uid ='${uid}' and uid2 = '${uid2}' and is_friend=false
        or uid ='${uid2}' and uid2 = '${uid}' and is_friend=false
        returning *`)
    ).rows[0];

    return refriend;
  }

  public async checkifblocked({ uid }: BlockBody, user_name: string) {
    const uid2 = (
      await this.dbContext.db.raw(`select uid from "User" 
    where user_name='${user_name}'`)
    ).rows[0].uid;
    const check = (
      await this.dbContext.db.raw(`select is_blocked from "Block"
      where uid='${uid}' and uid2='${uid2}'
      or uid='${uid2}' and uid2='${uid}'`)
    ).rows;

    if (check[0]) {
      return check[0]?.is_blocked;
    }

    return null;
  }
}

export default FriendsDAO;
