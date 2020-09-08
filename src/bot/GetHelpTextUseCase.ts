export class GetHelpUseCase {
  get(text: string): string {
    const botName = process.env.BOT_NAME;
    const command = text.split("help")[1];

    if (command.match("leaderboard")) {
      return `"@${botName} leaderboard" will output the current leaderboard`;
    }
    return `"@${botName} help command" will output more info about that command.`;
  }
}
