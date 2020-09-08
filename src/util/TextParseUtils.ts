import { Mention, Activity, TurnContext } from "botbuilder";

export function getMentions(activity: Activity): Mention[] {
  const mentions = TurnContext.getMentions(activity);
  return mentions.filter(
    (mention) => mention.mentioned.name != process.env.BOT_NAME
  );
}
