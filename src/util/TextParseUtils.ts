import { ActivityHandler, MessageFactory, Mention, Activity, Entity, ChannelAccount, BrowserLocalStorage, TurnContext } from 'botbuilder';
export function getStuffAfter(keyWord:string, text:string):Array<string>{
    // Grab everything after key word
    let brokenText = text.split(keyWord);
    if (brokenText.length<2){
        return [];
    } 
    return brokenText[1].split(" ");
}

// @mentions come through as enclosed in <at></at> tags. Whatever is left is @commands
    // This function returns the words connected to those @ symbols. You'll need to do some work later to gather additional params for those commands
export function getAtCmds(messageText: string):Array<string>{
        if (!messageText.includes("@")){
            return [];
        }
        let cmdWords: Array<string> = [];
        const commands = messageText.split('@');
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
    export function getMentions(entities:Array<Entity>, uniqueOnly:boolean = true){
        let botName = process.env.BOT_NAME;
        let mentions: Array<ChannelAccount> = [];
            for (const entity of entities){
                if (entity.type != "mention"){
                    continue;
                }
                const mention = entity as Mention;
                if (mention.mentioned.name.toLowerCase() === botName.toLowerCase()){
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