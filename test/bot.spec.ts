import { FakeKudoDbGateway } from "../testHelpers/fakeDBGateway";
import { FakeTeamsGateway } from "../testHelpers/fakeTeamsGateway";
import { GetLeaderboardUseCase } from "../src/kudo/GetLeaderboardUseCase";
import { GiveKudoUseCase } from "../src/kudo/GiveKudoUseCase";
import { GetHelpUseCase } from "../src/bot/GetHelpTextUseCase";
import { KudoBot } from "../src/bot/KudoBot";
import { TestAdapter } from "botbuilder";

const kudoFileDbGateway = new FakeKudoDbGateway();
const teamsGateway = new FakeTeamsGateway("FAKE_TEAM_ID");
const getLeaderboardUseCase = new GetLeaderboardUseCase(
  kudoFileDbGateway,
  teamsGateway
);
const giveKudoUseCase = new GiveKudoUseCase(kudoFileDbGateway);
const getHelpUseCase = new GetHelpUseCase();
const bot = new KudoBot(getLeaderboardUseCase, giveKudoUseCase, getHelpUseCase);

const testAdapter = new TestAdapter(async (context) => bot.run(context));

test("When sending @leaderboard message to bot get help text", async () => {
  giveKudoUseCase.giveKudo("1", "Test User 1", "FAKE_TEAM_ID");
  giveKudoUseCase.giveKudo("1", "Test User 1", "FAKE_TEAM_ID");
  giveKudoUseCase.giveKudo("2", "Test User 2", "FAKE_TEAM_ID");
  testAdapter.test(
    "@leaderboard",
    "**Team Fake**\n\n1. Test User 1 has *2* points.\n2. Test User 1 has *2* points.\n3. Test User 2 has *1* point."
  );
});
