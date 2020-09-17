import { PointRecordDBGateway } from "./PointRecordDBGateway";
import { TeamsGateway } from "./TeamsGateway";
import { TurnContext } from "botbuilder";
import { PointRecord } from "./PointRecord";
import { HELP_TEXT, LEADERBOARD_EMPTY } from "../bot/Replies";

export class GetLeaderboardUseCase {
  constructor(
    private pointRecordDBGateway: PointRecordDBGateway,
    private teamsGateway: TeamsGateway
  ) {}

  async get(msgContext: TurnContext) {
    const { id: teamId, name: teamName } = await this.teamsGateway.getTeamDetails(msgContext);
    const allRecords = this.pointRecordDBGateway.getAllRecords(teamId);
    const sortedAllRecords = allRecords.sort((a, b) => (a.getScore() > b.getScore() ? -1 : 1));

    const leaderBoardText =
      sortedAllRecords.map((record, index) => this.recordToTextRow(record, index + 1)).join("\n") ||
      `${LEADERBOARD_EMPTY}\n${HELP_TEXT}`;
    return `**${teamName}**\n\n${leaderBoardText}`;
  }

  private recordToTextRow(record: PointRecord, row: number) {
    const score = record.getScore();
    return `${row}. ${record.personName} has *${score}* point${score > 1 ? "s" : ""}.`;
  }
}
