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

test('Returns help text for @gendummydata command', () => {
  const currentIsTestingValue = process.env.IS_TESTING
  process.env.IS_TESTING = true
  const getKudoHelpUseCase = new GetKudoHelpUseCase("KudoBot");
  const helpText = getKudoHelpUseCase.getHelp("gendummydata");
  expect(helpText).toContain("\"@KudoBot @genDummyData\" will generate a bunch of dummy people and kudos");
  process.env.IS_TESTING = currentIsTestingValue
});

