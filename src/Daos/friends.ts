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

  public async addFriends({ uid, uid2 }: FriendsBody) {
    const is_friend = true;
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

  public async unfriend({ uid, uid2 }: FriendsBody) {
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

  public async checkiffriends({ uid, uid2 }: FriendsBody) {
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

  public async checkifnotfriends({ uid, uid2 }: FriendsBody) {
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

  public async refriend({ uid, uid2 }: FriendsBody) {
    const refriend = (
      await this.dbContext.db.raw(`update "Friends" set is_friend = true 
        where uid ='${uid}' and uid2 = '${uid2}' and is_friend=false
        or uid ='${uid2}' and uid2 = '${uid}' and is_friend=false
        returning *`)
    ).rows[0];

    return refriend;
  }

  public async checkifblocked({ uid, uid2 }: BlockBody) {
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
