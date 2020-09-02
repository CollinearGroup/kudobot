import { KudoRecordDBGateway } from "./KudoRecordDBGateway";
import { TeamsGateway } from "./TeamsGateway";
import { TurnContext } from "botbuilder";
import { KudoRecord } from "./KudoRecord";

export class GetLeaderboardUseCase {
  constructor(
    private kudoRecordDBGateway: KudoRecordDBGateway,
    private teamsGateway: TeamsGateway
  ) {}

  async get(msgContext: TurnContext) {
    const {
      id: teamId,
      name: teamName,
    } = await this.teamsGateway.getTeamDetails(msgContext);
    const allRecords = this.kudoRecordDBGateway.getAllRecords(teamId);
    const sortedAllRecords = allRecords.sort((a, b) =>
      a.kudos > b.kudos ? -1 : 1
    );

    const leaderBoard = sortedAllRecords
      .map((record, index) => this.recordToRow(record, index + 1))
      .join("\n");
    return `**${teamName}**\n\n${leaderBoard}`;
  }

  private recordToRow(record: KudoRecord, row: number) {
    return `${row}. ${record.personName} has *${record.kudos}* point${
      record.kudos > 1 ? "s" : ""
    }.`;
  }
}
