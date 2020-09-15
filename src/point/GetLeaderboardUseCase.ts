import { PointRecordDBGateway } from "./PointRecordDBGateway";
import { TeamsGateway } from "./TeamsGateway";
import { TurnContext } from "botbuilder";
import { PointRecord } from "./PointRecord";

export class GetLeaderboardUseCase {
  constructor(
    private pointRecordDBGateway: PointRecordDBGateway,
    private teamsGateway: TeamsGateway
  ) {}

  async get(msgContext: TurnContext) {
    const { id: teamId, name: teamName } = await this.teamsGateway.getTeamDetails(msgContext);
    const allRecords = this.pointRecordDBGateway.getAllRecords(teamId);
    const sortedAllRecords = allRecords.sort((a, b) => (a.getScore() > b.getScore() ? -1 : 1));

    const leaderBoard = sortedAllRecords
      .map((record, index) => this.recordToRow(record, index + 1))
      .join("\n");
    return `**${teamName}**\n\n${leaderBoard}`;
  }

  private recordToRow(record: PointRecord, row: number) {
    const score = record.getScore();
    return `${row}. ${record.personName} has *${score}* point${score > 1 ? "s" : ""}.`;
  }
}
