import { TurnContext } from 'botbuilder';
import { KudoStore } from '../db/Kudostore';
import { getHelpText } from './GetHelpText';
import { getStuffAfter } from '../util/TextParseUtils';
import { UsefulMessageData } from './UsefulMessageData';

export class HandleAtCmdUseCase {
    private msgData: UsefulMessageData;
    private kudoStore: KudoStore;
    private isTesting: boolean;
    private botName:string;
    constructor(msg:UsefulMessageData, kudoStore: KudoStore, isTesting = process.env.IS_TESTING){
        this.msgData = msg;
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
                    const board = this.kudoStore.leaderboard(this.msgData);
                    outputText += `---<b>${board.name}</b>---<br>`;
                    outputText += this.kudoStore.genLeaderboardText(board.kudoRecords);
                    break;
                case "gendummydata":
                    if (this.isTesting){
                    outputText += this.kudoStore.genDummyData(10, this.msgData);
                    outputText += "Dummy data created.";
                    }
                    break;
                case "clearboard":
                case "@clearboard":
                    // might consider adding some sort of way of double checking before blasting the whole thing
                    this.kudoStore.clearBoard(this.msgData.boardId);
                    outputText += `Leaderboard cleared. I hope you meant to do that...`;
                    break;
                case "help":
                    const command: string = getStuffAfter("@help", this.msgData.text)[0];
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