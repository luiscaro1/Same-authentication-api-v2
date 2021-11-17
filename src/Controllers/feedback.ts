import express, { request } from "express";
import passport from "passport";
import Injectable from "@/Decorators/Injectable";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import FeedbackDAO from "../Daos/feedback";

@Injectable("feedbackController")
class FeedbackController {
  @Inject("feedbackDAO") public static feedbackDAO: FeedbackDAO;

  // Feedback routes
  @route("POST", "addfeedback")
  public static async addfeedback(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const post = await FeedbackController.feedbackDAO.addFeedback(
        req.body as any
      );

      res.json(post).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }

  @route("GET", "getavgfeedbacks")
  public static async getAvgFeedbacks(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const avg = await FeedbackController.feedbackDAO.getAvgFb();

      res.json(avg).status(201).end();
    } catch (err) {
      res.status(400).send(err);
    }
  }
}

export default FeedbackController;
