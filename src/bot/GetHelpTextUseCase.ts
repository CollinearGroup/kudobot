import { LEADERBOARD, BUILD } from "./Commands";

export class GetHelpUseCase {
  get(text: string): string {
    const botName = process.env.BOT_NAME;
    const command = text.split("help")[1];

    if (command.match(LEADERBOARD)) {
      return `"@${botName} ${LEADERBOARD}" will output the current leaderboard`;
    }
    if (command.match(BUILD)) {
      return `"@${botName} ${BUILD}" will output the currently running KudoBot version number`;
    }
    return `Give Kudos by typing "@${botName} @Johnny Sample++ Great Job!" (where "Johnny Sample" is replaced by a mention of the person you would like to recognize)\n"@${botName} help command" will output more info about that command.\n Available commands: ${LEADERBOARD} and ${BUILD}`;
  }
}
