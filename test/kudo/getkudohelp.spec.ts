import { GetKudoHelpUseCase } from '../../src/kudo/GetKudoHelpUseCase'


test('Returns general help if no command is provided', () => {
    const getKudoHelpUseCase = new GetKudoHelpUseCase("KudoBot");
    const helpText = getKudoHelpUseCase.getHelp();
    expect(helpText).toContain("@help @command");
  });

  test('Returns help for @leaderboard command', () => {
    const getKudoHelpUseCase = new GetKudoHelpUseCase("KudoBot");
    const helpText = getKudoHelpUseCase.getHelp("leaderboard");
    expect(helpText).toContain("will output the current leaderboard");
  });