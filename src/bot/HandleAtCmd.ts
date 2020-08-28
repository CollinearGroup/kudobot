import { TurnContext } from 'botbuilder';
import { KudoStore } from '../db/Kudostore';
import { getHelpText } from './GetHelpText';
import { getStuffAfter } from '../util/GetStuffAfter';

export class HandleAtCmdUseCase {
    private msgContext;
    private kudoStore;
    private isTesting;
    private botName;
    constructor(msg:TurnContext, kudoStore: KudoStore, isTesting = process.env.IS_TESTING){
        this.msgContext = msg;
        this.kudoStore = kudoStore;
        this.botName = process.env.BOT_NAME;
        this.isTesting = isTesting === "true";
    }
    public handleCommands(cmds: Array<string>):string{
        let retString = "";
        for (const cmd of cmds){
            retString += this.handleCommand(cmd);
        }
        return retString;
    }
    public handleCommand(cmd:string):string{
        let outputText = "";
            switch (cmd.toLowerCase()){
                //TODO: add a way to display the source of kudos 
                case "leaderboard":
                    const board = this.kudoStore.leaderboard(this.msgContext);
                    outputText += `---<b>${board.name}</b>---<br>`;
                    outputText += this.kudoStore.genLeaderboardText(board.kudoRecords);
                    break;
                case "gendummydata":
                    if (this.isTesting){
                    outputText += this.kudoStore.genDummyData(10, this.msgContext);
                    outputText += "Dummy data created.";
                    }
                    break;
                case "clearboard":
                case "@clearboard":
                    // might consider adding some sort of way of double checking before blasting the whole thing
                    this.kudoStore.clearBoard(this.msgContext);
                    outputText += `Leaderboard cleared. I hope you meant to do that...`;
                    break;
                case "save":
                case "@save":
                    this.kudoStore.forceSave();
                    outputText += `Saved.`;
                    break;
                case "help":
                    const command: string = getStuffAfter("@help", this.msgContext.activity.text)[0];
                    outputText += getHelpText(command.replace("@", ""))
                    break;
                case "commands":
                case "command":
                default:
                    outputText+= `Try one of these commands: @leaderboard @help or try giving Kudos with "@${this.botName} @person++".`;
                    if (this.isTesting){
                        outputText+= `<br>@genDummyData is also an option for testing purposes`;
                    }
                    break;
            }
            if (outputText != ""){
                outputText += `<br>`;
            }
        return outputText;
    }
}