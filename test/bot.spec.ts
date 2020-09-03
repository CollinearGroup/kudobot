import { FakeKudoDbGateway } from "../testHelpers/fakeDBGateway";
import { FakeTeamsGateway } from "../testHelpers/fakeTeamsGateway";
import { TeamsInfo, TestAdapter } from "botbuilder";
import { createBot } from "../src/bot/BotConfiguration";
import { KudoRecord } from "../src/kudo/KudoRecord";
import { TeamsGatewayImpl } from "../src/teams/TeamsGatewayImpl";

const fakeKudoDbGateway = new FakeKudoDbGateway();

const bot = createBot(fakeKudoDbGateway, new TeamsGatewayImpl());
const TEAM_ID = "FAKE_TEAM_ID";
const testAdapter = new TestAdapter(async (context) => bot.run(context));

beforeAll(() => {
  process.env.BOT_NAME = "KudoBot";
  TeamsInfo.getTeamDetails = (context) =>
    new FakeTeamsGateway(TEAM_ID).getTeamDetails(context);
});

test("When sending @leaderboard get leaderboard output", async () => {
  const points = [5, 4, 1];
  fakeKudoDbGateway.save(
    new KudoRecord("1", "Test User 1", TEAM_ID, points[0])
  );
  fakeKudoDbGateway.save(
    new KudoRecord("2", "Test User 2", TEAM_ID, points[1])
  );
  fakeKudoDbGateway.save(
    new KudoRecord("3", "Test User 3", TEAM_ID, points[2])
  );
  await testAdapter.test(
    "@leaderboard",
    `**Team Fake**\n\n1. Test User 1 has *${points[0]}* points.\n2. Test User 2 has *${points[1]}* points.\n3. Test User 3 has *${points[2]}* point.`
  );
});
test("When sending @help @leaderboard get help text about that command", async () => {
  await testAdapter.test(
    "@help @leaderboard",
    `"@KudoBot @leaderboard" will output the current leaderboard`
  );
});
test("When sending message without matching command return default reply", async () => {
  await testAdapter.test(
    "What's up",
    `Something I can do for you User1?<br>Try @KudoBot @help for a list of things I can do!`
  );
});
