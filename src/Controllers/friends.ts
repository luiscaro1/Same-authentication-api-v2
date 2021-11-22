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
      return res.status(400).send("blocked user or user has you blocked").end();
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
        .send("you are already friends with this user")
        .end();
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
      return res.status(400).send("you are not friends with this user").end();
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

      res.json(post).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("DELETE", FriendsController.checkifnotfriends, "unfriend/:user_name")
  public static async unfriend(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await FriendsController.friendsDAO.unfriend(
        req.body as any,
        req.params.user_name as any
      );

      res.json(post).status(201).end();
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

      res.json(all).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default FriendsController;
