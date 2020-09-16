import { FakePointDbGateway, generatePoints } from "../testHelpers/fakeDBGateway";
import { FakeTeamsGateway } from "../testHelpers/fakeTeamsGateway";
import { TeamsInfo, TestAdapter } from "botbuilder";
import { createBot } from "../src/bot/BotConfiguration";
import { PointRecord } from "../src/point/PointRecord";
import { TeamsGatewayImpl } from "../src/teams/TeamsGatewayImpl";

const fakePointDbGateway = new FakePointDbGateway();

const bot = createBot(fakePointDbGateway, new TeamsGatewayImpl());
const TEAM_ID = "FAKE_TEAM_ID";
const testAdapter = new TestAdapter(async (context) => bot.run(context));

beforeAll(() => {
  TeamsInfo.getTeamDetails = (context) => new FakeTeamsGateway(TEAM_ID).getTeamDetails(context);
});

test("When sending 'leaderboard' get leaderboard output", async () => {
  fakePointDbGateway.save(new PointRecord("1", "Test User 1", TEAM_ID, generatePoints(5)));
  fakePointDbGateway.save(new PointRecord("2", "Test User 2", TEAM_ID, generatePoints(4)));
  fakePointDbGateway.save(new PointRecord("3", "Test User 3", TEAM_ID, generatePoints(1)));
  await testAdapter.test(
    "leaderboard",
    `**Team Fake**\n\n1. Test User 1 has *5* points.\n2. Test User 2 has *4* points.\n3. Test User 3 has *1* point.`
  );
});
test("When sending 'help leaderboard' get help text about that command", async () => {
  await testAdapter.test(
    "help leaderboard",
    `"@KudoBot leaderboard" will output the current leaderboard`
  );
});
test("When sending message without matching command return default reply", async () => {
  await testAdapter.test(
    "What's up",
    `Something I can do for you User1?<br>Try "@KudoBot help" for a list of things I can do!`
  );
});
