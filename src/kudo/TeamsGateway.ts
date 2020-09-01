import { TurnContext } from "botbuilder";

import { TurnContext, TeamDetails } from 'botbuilder';

export interface TeamsGateway {
  getTeamDetails(msgContext: TurnContext): Promise<TeamDetails>
}
