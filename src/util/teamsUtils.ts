import { TurnContext, TeamsChannelData } from "botbuilder";

export function getTeamId(context: TurnContext): string {
    if (!context) {
        throw new Error('Missing context parameter');
    }

    if (!context.activity) {
        throw new Error('Missing activity on context');
    }

    const channelData = context.activity.channelData as TeamsChannelData;
    const team = channelData && channelData.team ? channelData.team : undefined;
    const teamId = team && typeof(team.id) === 'string' ? team.id : undefined;
    return teamId;
}