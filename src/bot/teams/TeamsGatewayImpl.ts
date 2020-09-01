import { TeamsGateway } from "../../kudo/TeamsGateway";
import { TurnContext, TeamsInfo } from "botbuilder";
import { TurnContext, TeamDetails, TeamsInfo } from 'botbuilder';

export class TeamsGatewayImpl implements TeamsGateway {

  getTeamDetails(msgContext: TurnContext): Promise<TeamDetails> {
    return TeamsInfo.getTeamDetails(msgContext);
  }

}
