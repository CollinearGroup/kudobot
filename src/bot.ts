// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.

//TODO: add a way to add more than 1 kudo per ++. Using ++10 maybe? 
//TODO: handle private messages better
//TODO: research if use of webhooks could around the mention requirement
//TODO: point save/load at a database rather than local file
//TODO: update help text
//TODO: do actual test cases
//TODO: add a way to display the source of kudo

import { ActivityHandler, MessageFactory, Mention, Activity, Entity, ChannelAccount, BrowserLocalStorage, TurnContext } from 'botbuilder';
import { KudoStore } from './db/Kudostore';
import { getHelpText } from './bot/GetHelpText';
import { HandleAtCmdUseCase } from './bot/HandleAtCmd';

export class KudoBot extends ActivityHandler {
    private botName;
    private kudoStore: KudoStore;

    constructor(kudoStore: KudoStore) {
        super();

        this.botName = process.env.BOT_NAME;
        this.kudoStore = kudoStore;
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
                const atCmdHandler = new HandleAtCmdUseCase(context, this.kudoStore);
                replyText += atCmdHandler.handleCommands(containedAtCmds);               
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



