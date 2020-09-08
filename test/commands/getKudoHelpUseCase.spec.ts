import { GetHelpUseCase } from "../../src/bot/GetHelpTextUseCase";

const getHelpUseCase = new GetHelpUseCase();

test("Returns general help if no command is provided", () => {
  const helpText = getHelpUseCase.get("help");
  expect(helpText).toContain("help command");
});

test("Returns help for 'leaderboard' command", () => {
  const helpText = getHelpUseCase.get("help leaderboard");
  expect(helpText).toContain("will output the current leaderboard");
});
