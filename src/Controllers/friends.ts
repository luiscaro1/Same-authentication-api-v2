import express, { request } from "express";
import passport from "passport";
import Injectable from "@/Decorators/Injectable";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import FriendsDAO from "../Daos/friends";

@Injectable("friendsController")
class FriendsController {
  @Inject("friendsDAO") public static friendsDAO: FriendsDAO;

  // Friends routes
  @route("POST", "addfriend")
  public static async addfriend(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await FriendsController.friendsDAO.addFriends(
        req.body as any
      );

      res.json(post).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("DELETE", "unfriend")
  public static async unfriend(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await FriendsController.friendsDAO.unfriend(req.body as any);

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
