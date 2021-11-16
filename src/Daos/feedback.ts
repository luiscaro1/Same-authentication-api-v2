/* eslint-disable camelcase */
import bcrypt from "bcryptjs";
import { stringify } from "qs";
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";

// interface AccountBody {
//   user_name: string;
//   password: string;
//   email: string;
//   first_name: string;
//   last_name: string;
// }

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
    // const feedback = await db.raw(`insert values('${email}','${websitedesign}','${ratedesign}','${websitefunctionality}','${ratefunctionality}','${gameavailable}','${rategames}','${generalinformation}','${rateoverall}')into "Feedback" returning "*"`);
    const feedback = await db
      .insert({
        email,
        websitedesign,
        ratedesign,
        websitefunctionality,
        ratefunctionality,
        gameavailable,
        rategames,
        generalinformation,
        rateoverall,
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
