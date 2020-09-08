import { Mention, Activity, TurnContext } from "botbuilder";

// this method grabs all the mentions in the given activity -- It also scrubs mentions of the bot itself.
// specify uniqueOnly false to include multiple mentions
export function getMentions(activity: Activity): Mention[] {
  const mentions = TurnContext.getMentions(activity);
  return mentions.filter(
    (mention) => mention.mentioned.name != process.env.BOT_NAME
  );
}
