import { KudoRecord } from "./KudoRecord";
import { KudoRecordDBGateway } from "./KudoRecordDBGateway";

export class GiveKudoUseCase {
  constructor(private kudoRecordDb: KudoRecordDBGateway) {}

  public giveKudo(
    personTeamsId: string,
    personName: string,
    teamId: string
  ): string {
    let record: KudoRecord = this.kudoRecordDb.findRecord(
      personTeamsId,
      teamId
    );
    if (!record.exists()) {
      record = new KudoRecord(personTeamsId, personName, teamId, 0);
    }
    record.kudos++;
    this.kudoRecordDb.save(record);

    return `${record.personName} has *${record.kudos}* point${
      record.kudos > 1 ? "s" : ""
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
