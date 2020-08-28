export function getHelpText(command = ""): string {
  const botName = process.env.BOT_NAME;
    if (command === "leaderboard") {
      return `"@${botName} @leaderboard" will output the current leaderboard`
    }
    if (process.env.IS_TESTING) {
      if (command === "gendummydata") {
        return `"@${botName} @genDummyData" will generate a bunch of dummy people and kudos`
      }
    }
    return `"@${botName} @help @command" will output more info about that command.`
  }
