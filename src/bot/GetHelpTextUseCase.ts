import { LEADERBOARD, BUILD } from "./Commands";
import { HELP_BUILD, HELP_LEADERBOARD, HELP_TEXT } from "./Replies";

export class GetHelpUseCase {
  get(text: string): string {
    const command = text.split("help")[1];

    if (command.match(LEADERBOARD)) {
      return HELP_LEADERBOARD;
    }
    if (command.match(BUILD)) {
      return HELP_BUILD;
    }
    return HELP_TEXT;
  }
}
