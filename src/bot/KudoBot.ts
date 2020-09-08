import {
  ActivityHandler,
  MessageFactory,
  TeamsInfo,
  TurnContext,
} from "botbuilder";
import { GetLeaderboardUseCase } from "../point/GetLeaderboardUseCase";
import { GivePointUseCase } from "../point/GivePointUseCase";
import {
  BUILD,
  getFirstCommand,
  GIVE_POINT,
  HELP,
  LEADERBOARD,
} from "./Commands";
import { GetHelpUseCase } from "./GetHelpTextUseCase";
import { getMentions } from "../util/TextParseUtils";
import { GetBuildNumUseCase } from "../point/GetBuildNumUseCase";

export class KudoBot extends ActivityHandler {
  constructor(
    private getLeaderBoardUseCase: GetLeaderboardUseCase,
    private givePointUseCase: GivePointUseCase,
    private getHelpUseCase: GetHelpUseCase,
    private getBuildNumUseCase: GetBuildNumUseCase
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
        case GIVE_POINT:
          await this.handleGivePoint(context);
          break;
        case BUILD:
          await this.handleBuildNum(context);
          break;
        default:
          await this.handleDefault(context);
          break;
      }

      await next();
    });
  }

  private async handleBuildNum(context: TurnContext) {
    await this.sendReply(this.getBuildNumUseCase.get(), context);
  }

  private async handleDefault(context: TurnContext) {
    const botName = process.env.BOT_NAME || "KudoBot";
    let replyText = `Something I can do for you ${
      context.activity.from.name.split(" ")[0]
    }?<br>`;
    replyText += `Try "@${botName} help" for a list of things I can do!`;
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

  private async handleGivePoint(context: TurnContext) {
    const teamDetails = await TeamsInfo.getTeamDetails(context);
    const { mentioned } = getMentions(context.activity)[0];
    const reply = this.givePointUseCase.givePoint(
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
      if (activity.text.includes(incrementedName)) return GIVE_POINT;
    }

    let firstCommand = getFirstCommand(activity.text);
    if (LEADERBOARD === firstCommand) return LEADERBOARD;
    if (HELP === firstCommand) return HELP;
    if (BUILD === firstCommand) return BUILD;

    return "UNKNOWN";
  }
}
