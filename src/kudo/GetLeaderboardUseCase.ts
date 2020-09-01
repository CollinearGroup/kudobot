import { KudoRecordDBGateway } from "./KudoRecordDBGateway";
import { TeamsGateway } from "./TeamsGateway";
import { TurnContext } from "botbuilder";

export class GetLeaderboardUseCase {
  constructor(
    private kudoRecordDBGateway: KudoRecordDBGateway,
    private teamsGateway: TeamsGateway
    ) { }

  async getLeaderboard(msgContext: TurnContext) {
    const { id: teamId, name: teamName } = await this.teamsGateway.getTeamDetails(msgContext);
    const allRecords = this.kudoRecordDBGateway.getAllRecords(teamId);
    const sortedAllRecords = allRecords.sort((a, b) => a.score > b.score ? -1 : 1);//desc
    return [teamName].concat(sortedAllRecords
                      .map(record =>
                        `${record.personName} has ${record.score} point${record.score > 1 ? 's' : ''}.`)
                      )
                      .join('\n');

  }
}
