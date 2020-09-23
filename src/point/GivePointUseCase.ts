import { PointRecord } from "./PointRecord";
import { PointRecordDBGateway } from "./PointRecordDBGateway";
import * as fs from "fs";

export class GivePointUseCase {
  constructor(private pointRecordDb: PointRecordDBGateway) {}

  public givePoint(personTeamsId: string, personName: string, teamId: string): string {
    let record: PointRecord = this.pointRecordDb.findRecord(personTeamsId, teamId);
    if (!record.exists()) {
      record = new PointRecord(personTeamsId, personName, teamId);
    }
    record.addPoint();
    this.pointRecordDb.save(record);

    const thirtyDaysAgo = new Date(new Date().setDate(new Date().getDate() - 30));
    const score = record.getScore(thirtyDaysAgo);
    return `${record.personName} has *${score}* point${
      score > 1 ? "s" : ""
    }. ${this.getRandomEncouragement()}`;
  }

  private getRandomEncouragement() {
    const items = fs.readFileSync("./encouragements.txt", "utf-8").split("\n");
    return items[Math.floor(Math.random() * items.length)];
  }
}
