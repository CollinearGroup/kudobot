import { getHelpText } from '../../src/bot/GetHelpText'


test('Returns general help if no command is provided', () => {
    const helpText = getHelpText();
    expect(helpText).toContain("@help @command");
  });

test('Returns help for @leaderboard command', () => {
    const helpText = getHelpText("leaderboard");
    expect(helpText).toContain("will output the current leaderboard");
  });

test('Returns help text for @gendummydata command', () => {
  const currentIsTestingValue = process.env.IS_TESTING
  process.env.IS_TESTING = "true"
  const helpText = getHelpText("gendummydata");
  expect(helpText).toContain(`\"@${process.env.BOT_NAME} @genDummyData\" will generate a bunch of dummy people and kudos`);
  process.env.IS_TESTING = currentIsTestingValue
});

