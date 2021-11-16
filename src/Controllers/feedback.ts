import express, { request } from "express";
import passport from "passport";
import Injectable from "@/Decorators/Injectable";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import FeedbackDAO from "../Daos/feedback";

// const valEmail = function (
//     req: express.Request,
//     res: express.Response,
//     next: express.NextFunction
//   ) {
//     passport.authenticate(
//       "local",

//       (err1, email, info) => {
//         if (err1) {
//           return next(err1);
//         }
//         if (!email) {
//           return res.status(400).send(info);
//         }
//       }
//     )(req, res, next);
//   };

@Injectable("feedbackController")
class FeedbackController {
  @Inject("feedbackDAO") public static feedbackDAO: FeedbackDAO;

  // TODO: Handle media messages with media server
  //   @route("POST", "addfeedback")
  //   public static async addfeedback(): Promise<void> {
  //     console.log("login");
  //   }

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
