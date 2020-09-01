import { TurnContext, ChannelAccount, Activity, TeamsInfo} from 'botbuilder';
import {getMentions, getAtCmds} from '../util/TextParseUtils';
import { getTeamId } from '../util/teamsUtils';

export class UsefulMessageData {
    private fullContext;
    text: string;
    get teamName(): string{
        if(!this._teamName){
            this.getTeamName();
        }
        return this._teamName;
    }
    private _teamName: string = "loading...";

    get boardId(): string{
        if (!this._boardId){
            this._boardId = getTeamId(this.fullContext);
        }
        return this._boardId;
    }
    private _boardId: string;

    get uniqueMentions(): Array<ChannelAccount>{
        if (!this._uniMentions){
            this._uniMentions = getMentions(this.fullContext.activity.entities);
        }
        return this._uniMentions;
    }
    private _uniMentions: Array<ChannelAccount>;

    get containedAtCmds(): Array<string>{
        if (!this._contAtCmds){
            this._contAtCmds = getAtCmds(this.fullContext.activity.text)
        }
        return this._contAtCmds;
    }
    private _contAtCmds: Array<string>;
    conversationType: string; //"personal" | "channel"

    from: string;
    constructor(context: TurnContext){
        this.fullContext = context;
        this.text = context.activity.text;
        this.conversationType = context.activity.conversation.conversationType;
        this.from = context.activity.from.id;
    }
    async getTeamName(){
            if (this.conversationType == "channel"){
                const teamDetails = TeamsInfo.getTeamDetails(this.fullContext);
                teamDetails.then((data)=>{
                    this._teamName = data.name;
                })
            return;
            }        
            this._teamName = "Private";
    }
}