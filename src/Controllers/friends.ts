import express from "express";
import Injectable from "@/Decorators/Injectable";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import FriendsDAO from "../Daos/friends";

@Injectable("friendsController")
class FriendsController {
  @Inject("friendsDAO") public static friendsDAO: FriendsDAO;

  // middleware for friends
  public static checkiffriends = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const is_blocked = await FriendsController.friendsDAO.checkifblocked(
      req.body as any,
      req.params.user_name as any
    );
    if (is_blocked === true) {
      return res
        .status(400)
        .send({ message: "blocked user or user has you blocked" });
    }
    const is_friend = await FriendsController.friendsDAO.checkiffriends(
      req.body as any,
      req.params.user_name as any
    );
    if (is_friend === false) {
      const re = await FriendsController.friendsDAO.refriend(
        req.body as any,
        req.params.user_name as any
      );
      res.json(re);
    } else if (is_friend === true) {
      return res
        .status(400)
        .send({ message: "you are already friends with this user" });
    } else {
      next();
    }
  };

  // middleware for unfriend
  public static checkifnotfriends = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const is_friend = await FriendsController.friendsDAO.checkifnotfriends(
      req.body as any,
      req.params.user_name as any
    );
    if (is_friend === false) {
      return res
        .status(400)
        .send({ message: "you are not friends with this user" });
    }

    next();
  };

  // Friends routes
  @route("POST", FriendsController.checkiffriends, "addfriend/:user_name")
  public static async addfriend(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await FriendsController.friendsDAO.addFriends(
        req.body as any,
        req.params.user_name as any
      );

      res.json(post);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("PUT", FriendsController.checkifnotfriends, "unfriend/:user_name")
  public static async unfriend(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await FriendsController.friendsDAO.unfriend(
        req.body as any,
        req.params.user_name as any
      );

      res.json(post);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("GET", "getallfriends")
  public static async getallfriends(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const all = await FriendsController.friendsDAO.getallfriends(
        req.body as any
      );

      res.json(all);
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("POST", "friendcount/")
  public static async getfriendcount(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const count = await FriendsController.friendsDAO.getfriendcount(
        req.body as any
      );

      res.json(count);
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default FriendsController;
