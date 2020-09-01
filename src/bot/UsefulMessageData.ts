import { TurnContext, ChannelAccount, Activity, TeamsInfo} from 'botbuilder';
import {getMentions, getAtCmds} from '../util/TextParseUtils';
import { getTeamId } from '../util/teamsUtils';

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
        this.boardId = getTeamId(context);
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
}