/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import { stringify } from "qs";
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";

interface FriendsBody {
  uid: string;
  uid2: string;
}

interface id {
  uid: string;
}

interface GAF {
  // get all friends
  fid: string;
  uid: string;
  uid2: string;
  is_friend: boolean;
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

  //   public async unfriend({ uid, uid2 }: FriendsBody) {
  //     const unfriend = (
  //       await this.dbContext.db.raw(`update "Friends" set is_friend = false
  //         where uid ='${uid}' and uid2 = '${uid2}' and is_friend=True
  //         or uid ='${uid2}' and uid2 ='${uid}' and is_friend=True
  //         returning *`)
  //     ).rows[0];

  //     return unfriend;
  //   }

  //   // funciona pero por alguna razon no quiere funcionar lo de row[0]
  //   public async getallfriends({ uid }: id): Promise<Array<GAF>> {
  //     //
  //     const gaf = await this.dbContext.db.raw(`select * from "Friends"
  //         where uid='${uid}' or uid2='${uid}' and is_friend=true`); // .get('rows')

  //     return gaf;
  //   }
}

export default FriendsDAO;
