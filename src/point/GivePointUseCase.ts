import { PointRecord } from "./PointRecord";
import { PointRecordDBGateway } from "./PointRecordDBGateway";

export class GivePointUseCase {
  constructor(private pointRecordDb: PointRecordDBGateway) {}

  public givePoint(
    personTeamsId: string,
    personName: string,
    teamId: string
  ): string {
    let record: PointRecord = this.pointRecordDb.findRecord(
      personTeamsId,
      teamId
    );
    if (!record.exists()) {
      record = new PointRecord(personTeamsId, personName, teamId, 0);
    }
    record.points++;
    this.pointRecordDb.save(record);

    return `${record.personName} has *${record.points}* point${
      record.points > 1 ? "s" : ""
    }. ${this.getRandomEncouragement()}`;
  }

  private getRandomEncouragement() {
    const items = [
      "Great Job!",
      "You're crushing it!",
      "Well done.",
      "Wow!",
      "Excellent!",
    ];
    return items[Math.floor(Math.random() * items.length)];
  }
}
