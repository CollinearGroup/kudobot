import { FakePointDbGateway } from "../../testHelpers/fakeDBGateway";
import { PointRecord } from "../../src/point/PointRecord";
import { GetLeaderboardUseCase } from "../../src/point/GetLeaderboardUseCase";
import { FakeTeamsGateway } from "../../testHelpers/fakeTeamsGateway";
import { TeamsInfo, TestAdapter, TurnContext, TeamDetails } from "botbuilder";
import { TeamsGatewayImpl } from "../../src/teams/TeamsGatewayImpl";

let getLeaderboardUseCase = null;
const TEAM_ID = "FAKE_TEAM_ID";

beforeAll(() => {
  TeamsInfo.getTeamDetails = (context) =>
    new FakeTeamsGateway(TEAM_ID).getTeamDetails(context);
});

beforeEach(() => {
  const fakeDBGateway = new FakePointDbGateway();
  fakeDBGateway.save(new PointRecord("1", "Carlos", TEAM_ID, 3));
  fakeDBGateway.save(new PointRecord("1", "Carlos", TEAM_ID, 4));
  fakeDBGateway.save(new PointRecord("1", "Carlos", TEAM_ID, 5));

  fakeDBGateway.save(new PointRecord("3", "Jeff", TEAM_ID, 1));
  fakeDBGateway.save(new PointRecord("2", "Miguel", TEAM_ID, 2));

  getLeaderboardUseCase = new GetLeaderboardUseCase(
    fakeDBGateway,
    new TeamsGatewayImpl()
  );
});
test("Should return leaderboard in desc order", async () => {
  const adapter = new TestAdapter(async (context) => {
    const response = await getLeaderboardUseCase.get(context);
    expect(response).toContain("Team Fake");
    // Carlos should be on the top of leaderboard
    expect(
      response.indexOf("Carlos") < response.indexOf("Miguel")
    ).toBeTruthy();
    expect(response.indexOf("Miguel") < response.indexOf("Jeff")).toBeTruthy();
  });
  await adapter.send("leaderboard");
});

test("Should not duplicate people on the leaderboard", async () => {
  const adapter = new TestAdapter(async (context) => {
    const response = await getLeaderboardUseCase.get(context);
    expect(
      response.indexOf("Carlos") === response.lastIndexOf("Carlos")
    ).toBeTruthy();
  });
  await adapter.send("leaderboard");
});
