/* eslint-disable camelcase */
import Inject from "@/Decorators/Inject";
import Injectable from "@/Decorators/Injectable";
import DbContext from "@/Db/Index";

interface ReportBody {
  uid: string;
  uid2: string;
  stalking: boolean;
  spamming: boolean;
  offensive: boolean;
  harrasment: boolean;
  discrimination: boolean;
  viruses: boolean;
  violationofIp: boolean;
  pretending: boolean;
}

interface ModBod {
  uid: string;
  user_name: string;
  stalking: boolean;
  spamming: boolean;
  offensive: boolean;
  harrasment: boolean;
  discrimination: boolean;
  viruses: boolean;
  violationofIp: boolean;
  pretending: boolean;
}

@Injectable("reportDAO")
class ReportDAO {
  @Inject("dbContext") public dbContext!: DbContext;

  public async getallReports(): Promise<Array<ReportBody>> {
    const reports = await this.dbContext.db.select().from("Report");
    return reports;

    // const db = await this.dbContext.db;
    // const query = `select * from "Report"`;
    // // console.log(query);
    // const result = (await db.raw(query)).rows[0];
    // return result;
  }

  public async reportUser({
    uid,
    user_name,
    stalking,
    spamming,
    offensive,
    harrasment,
    discrimination,
    viruses,
    violationofIp,
    pretending,
  }: ModBod) {
    const db = await this.dbContext.db;
    const uid2 = (
      await db.raw(`select uid from "User" where user_name='${user_name}'`)
    ).rows[0].uid;
    const result = await db
      .insert({
        uid,
        uid2,
        stalking,
        spamming,
        offensive,
        harrasment,
        discrimination,
        viruses,
        violationofIp,
        pretending,
      })
      .into("Report")
      .returning("*");

    return result;
  }
}

export default ReportDAO;
