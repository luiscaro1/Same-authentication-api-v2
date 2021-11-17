import express, { request } from "express";
import passport from "passport";
import Injectable from "@/Decorators/Injectable";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import BlockDAO from "../Daos/block";

@Injectable("blockController")
class BlockController {
  @Inject("blockDAO") public static blockDAO: BlockDAO;

  // block/unblock routes
  @route("POST", "blockuser")
  public static async blockuser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await BlockController.blockDAO.blockuser(req.body as any);

      res.json(post).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("DELETE", "unblock")
  public static async unblock(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await BlockController.blockDAO.unblock(req.body as any);

      res.json(post).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("GET", "getallblocked")
  public static async getallblocked(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const all = await BlockController.blockDAO.getallblocked(req.body as any);

      res.json(all).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("GET", "getallblockedby")
  public static async getallblockedby(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const all = await BlockController.blockDAO.getallblockedby(
        req.body as any
      );

      res.json(all).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default BlockController;
