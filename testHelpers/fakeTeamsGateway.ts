import { TeamsGateway } from "../src/kudo/TeamsGateway";
import { TurnContext, TeamDetails } from "botbuilder";

export class FakeTeamsGateway implements TeamsGateway {

  constructor(private teamId: string) {}

  getTeamDetails(msgContext: TurnContext): Promise<TeamDetails> {
    return new Promise(resolve => {
      resolve({
        id: this.teamId,
        name: "Team Fake"
      }
      )
    })
  }
}