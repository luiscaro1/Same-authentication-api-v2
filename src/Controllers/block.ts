import express from "express";
import Injectable from "@/Decorators/Injectable";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import BlockDAO from "../Daos/block";

@Injectable("blockController")
class BlockController {
  @Inject("blockDAO") public static blockDAO: BlockDAO;

  // middleware for blocked
  public static checkifblocked = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const is_blocked = await BlockController.blockDAO.checkifblock(
      req.body as any,
      req.params.user_name as any
    );
    if (is_blocked === false) {
      const re = await BlockController.blockDAO.reblock(
        req.body as any,
        req.params.user_name as any
      );
      res.json(re);
    } else if (is_blocked === true) {
      return res.status(400).send("user is already blocked").end();
    } else {
      next();
    }
  };

  // middleware for unblock
  public static checkifunblocked = async (
    req: express.Request,
    res: express.Response,
    next: express.NextFunction
  ) => {
    const is_unblocked = await BlockController.blockDAO.checkifunblock(
      req.body as any,
      req.params.user_name as any
    );

    if (is_unblocked === false) {
      return res.status(400).send("user is not blocked").end();
    }

    next();
  };

  // block/unblock routes
  @route("POST", BlockController.checkifblocked, "blockuser/:user_name")
  public static async blockuser(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await BlockController.blockDAO.blockuser(
        req.body as any,
        req.params.user_name as any
      );
      // si son friends after blocking it will automatically unfrind eachother
      await BlockController.blockDAO.unfriend(
        req.body as any,
        req.params.user_name as any
      );

      res.json(post).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("PUT", BlockController.checkifunblocked, "unblock/:user_name")
  public static async unblock(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await BlockController.blockDAO.unblock(
        req.body as any,
        req.params.user_name as any
      );

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

  @route("POST", "blockcount")
  public static async getblockcount(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const count = await BlockController.blockDAO.getblockcount(
        req.body as any
      );

      res.json(count).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default BlockController;
