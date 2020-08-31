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
import { HandleAtCmdUseCase } from './bot/HandleAtCmd';
import { UsefulMessageData } from './bot/UsefulMessageData'

export class KudoBot extends ActivityHandler {
    private botName;
    private kudoStore: KudoStore;

    constructor(kudoStore: KudoStore) {
        super();

        this.botName = process.env.BOT_NAME;
        this.kudoStore = kudoStore;
        // See https://aka.ms/about-bot-activity-message to learn more about the message and other activity types.
        this.onMessage(async (context, next) => { 
            const messageData = new UsefulMessageData(context);                
            await messageData.getTeamName(context, kudoStore.setName.bind(kudoStore));
            let replyText= "";
            
            // handle @mentions
            if (messageData.uniqueMentions.length > 0){
                replyText += this.handleAtMentions(messageData.uniqueMentions, messageData);               
            }

            // handle @commands
            if (messageData.containedAtCmds && messageData.containedAtCmds.length > 0){
                const atCmdHandler = new HandleAtCmdUseCase(messageData, this.kudoStore);
                replyText += atCmdHandler.handleCommands(messageData.containedAtCmds);               
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

    // This function handles all of the names passed to it as if they were @mentions
    // note: ++ targets must be officially @mentioned 
    private handleAtMentions(uniqueMentions:Array<ChannelAccount>, msgData: UsefulMessageData): string{
        
        let outputText = ""; 
        //= `Looks like you mentioned ${uniqueMentions.join("and ")} <br>`;
        const kudoPeople = this.getTargets("++", msgData, uniqueMentions);
        const negKudoPeople = this.getTargets("--", msgData, uniqueMentions);
        
        if (kudoPeople.length > 0){
            // TODO: get value of kudo
            const updatedPeople = this.kudoStore.giveKudos(kudoPeople, msgData, 1);
            outputText += this.kudoStore.genLeaderboardText(updatedPeople, updatedPeople.length, true);
        }
        if (negKudoPeople.length > 0){
            // TODO: get value of kudo
            const updatedPeople = this.kudoStore.giveKudos(negKudoPeople, msgData, -1);
            outputText += this.kudoStore.genLeaderboardText(updatedPeople, updatedPeople.length, true);
        }
        if (outputText != ""){
            outputText += `<br>`;
        }
        return outputText;
    }

    // tries to determine who the ++ was attached to by looking for ++'s following @ mentions
    // if you'd like to include multiple ++'s to the same person, please specify uniqueOnly = false 
    private getTargets(modifier:string, msgData:UsefulMessageData, mentionedAccts: Array<ChannelAccount>, uniqueOnly:boolean = true){
        let kudoPeople: Array<ChannelAccount> = [];
        // cast text to lower and strip spaces
        const lowerMsgText = msgData.text.toLowerCase().replace(/\s+/g, '');

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



