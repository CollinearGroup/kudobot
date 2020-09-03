import {
  ActivityHandler,
  MessageFactory,
  TurnContext,
  TeamsInfo,
} from "botbuilder";
import { GetLeaderboardUseCase } from "../kudo/GetLeaderboardUseCase";
import { GiveKudoUseCase } from "../kudo/GiveKudoUseCase";
import { LEADERBOARD, HELP, GIVE_KUDO } from "./Commands";
import { GetHelpUseCase } from "./GetHelpTextUseCase";
import { getAtCommands, getMentions } from "../util/TextParseUtils";

export class KudoBot extends ActivityHandler {
  constructor(
    private getLeaderBoardUseCase: GetLeaderboardUseCase,
    private giveKudoUseCase: GiveKudoUseCase,
    private getHelpUseCase: GetHelpUseCase
  ) {
    super();
    this.onMessage(async (context, next) => {
      const command = this.parseTextToCommand(context);

      switch (command) {
        case LEADERBOARD:
          await this.handleLeaderboard(context);
          break;
        case HELP:
          await this.handleHelp(context);
          break;
        case GIVE_KUDO:
          await this.handleGiveKudo(context);
          break;
        default:
          await this.handleDefault(context);
          break;
      }

      await next();
    });
  }

  private async handleDefault(context: TurnContext) {
    const botName = process.env.BOT_NAME || "KudoBot";
    let replyText = `Something I can do for you ${
      context.activity.from.name.split(" ")[0]
    }?<br>`;
    replyText += `Try @${botName} @help for a list of things I can do!`;
    await this.sendReply(replyText, context);
  }

  private async handleLeaderboard(context: TurnContext) {
    const reply = await this.getLeaderBoardUseCase.get(context);
    await this.sendReply(reply, context);
  }

  private async handleHelp(context: TurnContext) {
    const reply = this.getHelpUseCase.get(context.activity.text);
    await this.sendReply(reply, context);
  }

  private async handleGiveKudo(context: TurnContext) {
    const teamDetails = await TeamsInfo.getTeamDetails(context);
    const { mentioned } = getMentions(context.activity)[0];
    const reply = this.giveKudoUseCase.giveKudo(
      mentioned.id,
      mentioned.name,
      teamDetails.id
    );
    await this.sendReply(reply, context);
  }

  private async sendReply(reply: string, context: TurnContext) {
    const activity = MessageFactory.text(reply, reply);
    activity.textFormat = "markdown";
    await context.sendActivity(activity);
  }

  private parseTextToCommand(context: TurnContext): string {
    const { activity } = context;

    const mentions = getMentions(activity);
    if (mentions.length > 0) {
      const {
        mentioned: { name },
      } = mentions[0];
      const incrementedName = `${name}</at>++`;
      if (activity.text.includes(incrementedName)) return GIVE_KUDO;
    }

    let firstCommand = getAtCommands(activity.text)[0];
    if (LEADERBOARD === firstCommand) return LEADERBOARD;
    if (HELP === firstCommand) return HELP;

    return "UNKNOWN";
  }
}
