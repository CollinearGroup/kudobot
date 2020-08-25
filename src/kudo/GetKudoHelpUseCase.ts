export class GetKudoHelpUseCase {

    private botName: string

    constructor(botName: string) {
        this.botName = botName;
    }

    public getHelp(command = ""): string {
        switch (command){
            case "leaderboard":
                return `"@${this.botName} @leaderboard" will output the current leaderboard`;
            case "gendummydata":
                if (process.env.IS_TESTING) {
                    return `"@${this.botName} @genDummyData" will generate a bunch of dummy people and kudos`;
                }
            default:
                return `"@${this.botName} @help @command" will output more info about that command.`;                                   
        }
    }
}