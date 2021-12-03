import express from "express";
import Injectable from "@/Decorators/Injectable";
import route from "@/Decorators/Route";
import Inject from "@/Decorators/Inject";
import ReportDAO from "../Daos/report";

@Injectable("reportController")
class ReportController {
  @Inject("reportDAO") public static reportDAO: ReportDAO;
  // TODO: Reporting a user

  // might not be working because the report table is not generating the rid
  @route("POST", "add")
  public static async reporting(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const result = await ReportController.reportDAO.reportUser(
        req.body as any
      );
      res.json(result);
    } catch (err) {
      res.status(400).send({ message: "Oops try again " });
    }
  }

  // Admin only
  @route("GET", "allreports")
  public static async getallReports(
    req: express.Request,
    res: express.Response
  ): Promise<void> {
    try {
      const reports = await ReportController.reportDAO.getallReports();
      res.json(reports);
    } catch (err) {
      res.status(400).send(err);
    }
  }
}
export default ReportController;
