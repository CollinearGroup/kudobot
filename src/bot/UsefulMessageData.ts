import { TurnContext, ChannelAccount, Activity, TeamsInfo} from 'botbuilder';
import {getMentions, getAtCmds} from '../util/TextParseUtils';

export class UsefulMessageData {
    text: string;
    boardId: string;
    teamName: string = "--Not Loaded Yet--";
    uniqueMentions: Array<ChannelAccount>; 
    containedAtCmds: Array<string>;
    conversationType: string; //"personal" | "channel"

    from: string;
    constructor(context: TurnContext){
        this.text = context.activity.text;
        this.uniqueMentions = getMentions(context.activity.entities);
        this.containedAtCmds = getAtCmds(context.activity.text);
        this.conversationType = context.activity.conversation.conversationType;
        this.boardId = this.getTeamId(context.activity);
        this.from = context.activity.from.id;
    }
    async getTeamName(msgContext: TurnContext, callb: (boardId: string, teamName: string) => void = (_,_2)=>{}){
        if (this.conversationType == "channel"){
            const teamDetails = TeamsInfo.getTeamDetails(msgContext);
            teamDetails.then((data)=>{
                this.teamName = data.name;
                callb(this.boardId, this.teamName);
            })
        return;
        }        
        this.teamName = "Private";
             callb(this.boardId, this.teamName);
    }


    private getTeamId(channelData: Activity):string{
        let teamId;
        if (this.conversationType == "personal"){
            // really this shouldn't happen since you cant @ anyone to add kudos but for testing its helpful to be able to
            teamId = channelData.channelData.tenant.id;
        }        
        if (this.conversationType == "channel"){
            teamId = channelData.channelData.team.id.split(":")[1].split("@")[0];
        }
        return teamId;         
    }
}