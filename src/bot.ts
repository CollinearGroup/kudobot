// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

//TODO: add a way to add more than 1 kudo per ++. Using ++10 maybe? 
//TODO: handle private messages better
//TODO: research if use of webhooks could around the mention requirement
//TODO: point save/load at a database rather than local file
//TODO: update help text
//TODO: do actual test cases

import { ActivityHandler, MessageFactory, Mention, Activity, Entity, ChannelAccount, BrowserLocalStorage, TurnContext } from 'botbuilder';
import { KudoStore } from './db/Kudostore';
import { GetKudoHelpUseCase } from './kudo/GetKudoHelpUseCase';

export class KudoBot extends ActivityHandler {
    private testing = process.env.IS_TESTING;
    private botName;
    private kudoStore: KudoStore;
    private getKudoHelpUseCase: GetKudoHelpUseCase;

    constructor(botName: string, kudoStore: KudoStore, getKudoHelpUseCase: GetKudoHelpUseCase) {
        super();

        this.botName = botName;
        this.kudoStore = kudoStore;
        this.getKudoHelpUseCase = getKudoHelpUseCase;
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => {                    
            const uniqueMentions = this.getMentions(context.activity); 
            const containedAtCmds = this.getAtCmds(context.activity);
            
            let replyText= "";
            
            // handle @mentions
            if (uniqueMentions.length > 0){
                replyText += this.handleAtMentions(uniqueMentions, context);               
            }

            // handle @commands
            if (containedAtCmds && containedAtCmds.length > 0){
                replyText += this.handleAtCmds(containedAtCmds, context);               
            }

            // handle other
            if (replyText == ""){
                // weird split at the end is to just respond with the first name
                replyText = `Something I can do for you ${context.activity.from.name.split(" ")[0]}?<br>`;
                replyText += `Try @${this.botName} @commands for a list of things I can do!`;
            }

            // send message
            await context.sendActivity(MessageFactory.text(replyText, replyText));
            
            // By calling next() you ensure that the next BotHandler is run.
            await next();
        });
    }

    // @mentions come through as enclosed in <at></at> tags. Whatever is left is @commands
    // This function returns the words connected to those @ symbols. You'll need to do some work later to gather additional params for those commands
    private getAtCmds(message: Activity):Array<string>{
        if (!message.text.includes("@")){
            return [];
        }
        let cmdWords: Array<string> = [];
        const commands = message.text.split('@');
        for (let i = 1; i< commands.length; i++){
            // just grab the command word -- we can deal with the rest elsewhere
            let cmd = commands[i].split(' ')[0];
            // stupid newline messing stuff up.
            cmdWords.push(cmd.split("\n")[0]);
        }
        return cmdWords;
    }

    // this method grabs all the mentions in the given activity -- It also scrubs mentions of the bot itself. 
    // specify uniqueOnly false to include multiple mentions
    private getMentions(message:Activity, uniqueOnly:boolean = true){
        let mentions: Array<ChannelAccount> = [];
            for (const entity of message.entities){
                if (entity.type != "mention"){
                    continue;
                }
                const mention = entity as Mention;
                if (mention.mentioned.name.toLowerCase() === this.botName.toLowerCase()){
                    continue;
                }
                mentions.push(mention.mentioned);
            }
            if (uniqueOnly){
                //remove duplicate mentions
                return Array.from(new Set(mentions));
            }
            return mentions;
    }

    // This function handles all of the names passed to it as if they were @mentions
    // note: ++ targets must be officially @mentioned 
    private handleAtMentions(uniqueMentions:Array<ChannelAccount>, msgContext: TurnContext): string{
        
        let outputText = ""; 
        //= `Looks like you mentioned ${uniqueMentions.join("and ")} <br>`;
        const kudoPeople = this.getTargets("++", msgContext.activity, uniqueMentions);
        const negKudoPeople = this.getTargets("--", msgContext.activity, uniqueMentions);
        
        if (kudoPeople.length > 0){
            // TODO: get value of kudo
            const updatedPeople = this.kudoStore.giveKudos(kudoPeople, msgContext, 1);
            outputText += this.kudoStore.genLeaderboardText(updatedPeople, updatedPeople.length, true);
        }
        if (negKudoPeople.length > 0){
            // TODO: get value of kudo
            const updatedPeople = this.kudoStore.giveKudos(negKudoPeople, msgContext, -1);
            outputText += this.kudoStore.genLeaderboardText(updatedPeople, updatedPeople.length, true);
        }
        if (outputText != ""){
            outputText += `<br>`;
        }
        return outputText;
    }

    // given a list of commands, this function attempts to carry them out on the given message
    private handleAtCmds(cmds: Array<string>, msgContext:TurnContext): string{
        let outputText = "";
        for (const cmd of cmds){
            switch (cmd.toLowerCase()){
                //TODO: add a way to display the source of kudos 
                case "leaderboard":
                    const board = this.kudoStore.leaderboard(msgContext);
                    outputText += `---<b>${board.name}</b>---<br>`;
                    outputText += this.kudoStore.genLeaderboardText(board.kudoRecords);
                    break;
                case "gendummydata":
                    if (this.testing){
                    outputText += this.kudoStore.genDummyData(10, msgContext);
                    outputText += "Dummy data created.";
                    }
                    break;
                case "clearboard":
                case "@clearboard":
                    // might consider adding some sort of way of double checking before blasting the whole thing
                    this.kudoStore.clearBoard(msgContext);
                    outputText += `Leaderboard cleared. I hope you meant to do that...`;
                    break;
                case "save":
                case "@save":
                    this.kudoStore.forceSave();
                    outputText += `Saved.`;
                    break;
                case "help":
                    const command: string = this.getStuffAfter("@help", msgContext.activity.text)[0];
                    outputText += this.getKudoHelpUseCase.getHelp(command.replace("@", ""))
                    break;
                case "commands":
                case "command":
                default:
                    outputText+= `Try one of these commands: @leaderboard @help or try giving Kudos with "@${this.botName} @person++".`;
                    if (this.testing){
                        outputText+= `<br>@genDummyData is also an option for testing purposes`;
                    }
                    break;
            }
            if (outputText != ""){
                outputText += `<br>`;
            }
        }
        return outputText;
    }  

    private getStuffAfter(keyWord:string, text:string):Array<string>{
        // Grab everything after key word
        let brokenText = text.split(keyWord);
        if (brokenText.length<2){
            return [];
        } 
        return brokenText[1].split(" ");
    }
    // tries to determine who the ++ was attached to by looking for ++'s following @ mentions
    // if you'd like to include multiple ++'s to the same person, please specify uniqueOnly = false 
    private getTargets(modifier:string, message:Activity, mentionedAccts: Array<ChannelAccount>, uniqueOnly:boolean = true){
        let kudoPeople: Array<ChannelAccount> = [];
        // cast text to lower and strip spaces
        const lowerMsgText = message.text.toLowerCase().replace(/\s+/g, '');

        for (const mentionedPerson of mentionedAccts){
            // cast text to lower and strip spaces
            const lowerPerson = mentionedPerson.name.toLowerCase().replace(/\s+/g, '');
            if (lowerMsgText.includes(`${lowerPerson}</at>${modifier}`)){
                kudoPeople.push(mentionedPerson);
            }
        }
        if (uniqueOnly){
            //remove duplicate mentions
            return Array.from(new Set(kudoPeople));
        }
        return kudoPeople;
    }
}



