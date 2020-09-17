import { BUILD, LEADERBOARD } from "./Commands";

export const LEADERBOARD_EMPTY = "Leaderboard is empty.";
export const HELP_TEXT = `Give Kudos by typing "@KudoBot @Johnny Sample++ Great Job!" (where "Johnny Sample" is replaced by a mention of the person you would like to recognize)\n"@KudoBot help command" will output more info about that command.\n Available commands: ${LEADERBOARD} and ${BUILD}`;
export const HELP_LEADERBOARD = `"@KudoBot ${LEADERBOARD}" will output the current leaderboard`;
export const HELP_BUILD = `"@KudoBot ${BUILD}" will output the currently running KudoBot version number`;
