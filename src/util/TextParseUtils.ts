import { Mention, Activity, TurnContext } from 'botbuilder';


// @mentions come through as enclosed in <at></at> tags. Whatever is left is @commands
    // This function returns the words connected to those @ symbols. You'll need to do some work later to gather additional params for those commands
export function getAtCommands(text: string): Array<string> {
    return text.split(" ")
                .map(str => str.trim())
                .filter(str => str.match("^@.*"))
}

// this method grabs all the mentions in the given activity -- It also scrubs mentions of the bot itself. 
// specify uniqueOnly false to include multiple mentions
export function getMentions(activity: Activity): Mention[] {
    const mentions = TurnContext.getMentions(activity);
    return mentions.filter(mention => mention.mentioned.name != process.env.BOT_NAME);
}