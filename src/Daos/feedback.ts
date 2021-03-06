/* eslint-disable camelcase */
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";

interface FeedbackBody {
  email: string;
  websitedesign: string;
  ratedesign: number;
  websitefunctionality: string;
  ratefunctionality: number;
  gameavailable: string;
  rategames: number;
  generalinformation: string;
  rateoverall: number;
}

interface AvgFeedbackBody {
  ratedesign: number;
  ratefunctionality: number;
  rategames: number;
  rateoverall: number;
}

@Injectable("feedbackDAO")
class FeedbackDAO {
  @Inject("dbContext") public dbContext!: DbContext;

  public async addFeedback({
    email,
    websitedesign,
    ratedesign,
    websitefunctionality,
    ratefunctionality,
    gameavailable,
    rategames,
    generalinformation,
    rateoverall,
  }: FeedbackBody) {
    const db = await this.dbContext.db;
    // added to match with the front end
    const rd = <number>ratedesign * 2;
    const rf = <number>ratefunctionality * 2;
    const rg = <number>rategames * 2;
    const ro = <number>rateoverall * 2;
    const feedback = await db
      .insert({
        email,
        websitedesign,
        ratedesign: rd,
        websitefunctionality,
        ratefunctionality: rf,
        gameavailable,
        rategames: rg,
        generalinformation,
        rateoverall: ro,
      })
      .into("Feedback")
      .returning("*");

    return feedback;
  }

  public async getAvgFb(): Promise<Array<AvgFeedbackBody>> {
    const avgfeedback = (
      await this.dbContext.db
        .raw(`select avg(ratedesign) as ratedesign, avg(ratefunctionality) as ratefunctionality,
    avg(rategames) as rategames, avg(rateoverall) as rateoverall from "Feedback"`)
    ).rows[0];

    avgfeedback.ratedesign = `${(avgfeedback.ratedesign * 10).toString()}%`;
    avgfeedback.ratefunctionality = `${(
      avgfeedback.ratefunctionality * 10
    ).toString()}%`;
    avgfeedback.rategames = `${(avgfeedback.rategames * 10).toString()}%`;
    avgfeedback.rateoverall = `${(avgfeedback.rateoverall * 10).toString()}%`;

    return avgfeedback;
  }
}

export default FeedbackDAO;
