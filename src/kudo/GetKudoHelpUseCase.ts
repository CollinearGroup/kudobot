export class GetKudoHelpUseCase {
  private botName: string

  constructor(botName: string) {
    this.botName = botName
  }

  public getHelp(command = ""): string {
    if (command === "leaderboard") {
      return `"@${this.botName} @leaderboard" will output the current leaderboard`
    }
    if (process.env.IS_TESTING) {
      if (command === "gendummydata") {
        return `"@${this.botName} @genDummyData" will generate a bunch of dummy people and kudos`
      }
    }
    return `"@${this.botName} @help @command" will output more info about that command.`
  }
}
