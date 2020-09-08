export const LEADERBOARD = "leaderboard";
export const GIVE_KUDO = "give_kudo";
export const HELP = "help";
export const BUILD = "build";

export function getFirstCommand(text: string): string {
  const possibleCommands = [LEADERBOARD, HELP, BUILD];
  return text
    .split(" ")
    .map((s) => s.trim())
    .find((s) => possibleCommands.includes(s));
}
