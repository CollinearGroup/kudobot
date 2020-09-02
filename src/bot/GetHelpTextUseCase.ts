export class GetHelpUseCase {
  get(text: string): string {
    const botName = process.env.BOT_NAME;
    const command = text.split("@help")[1];

    if (command.match("leaderboard")) {
      return `"@${botName} @leaderboard" will output the current leaderboard`;
    }
    if (process.env.IS_TESTING) {
      if (command.match("gendummydata")) {
        return `"@${botName} @genDummyData" will generate a bunch of dummy people and kudos`;
      }
    }
    return `"@${botName} @help @command" will output more info about that command.`;
  }
}
