import { FakePointDbGateway, generatePoints } from "../../testHelpers/fakeDBGateway";
import { PointRecord } from "../../src/point/PointRecord";
import { GetLeaderboardUseCase } from "../../src/point/GetLeaderboardUseCase";
import { FakeTeamsGateway } from "../../testHelpers/fakeTeamsGateway";
import { TeamsInfo, TestAdapter, TurnContext, TeamDetails } from "botbuilder";
import { TeamsGatewayImpl } from "../../src/teams/TeamsGatewayImpl";
import { Point } from "../../src/point/Point";

let getLeaderboardUseCase = null;
const TEAM_ID = "FAKE_TEAM_ID";

beforeAll(() => {
  TeamsInfo.getTeamDetails = (context) => new FakeTeamsGateway(TEAM_ID).getTeamDetails(context);
});

beforeEach(() => {
  const fakeDBGateway = new FakePointDbGateway();
  fakeDBGateway.save(new PointRecord("1", "Carlos", TEAM_ID, generatePoints(3)));
  fakeDBGateway.save(new PointRecord("1", "Carlos", TEAM_ID, generatePoints(4)));
  fakeDBGateway.save(new PointRecord("1", "Carlos", TEAM_ID, generatePoints(5)));
  fakeDBGateway.save(new PointRecord("3", "Jeff", TEAM_ID, generatePoints(1)));

  const miguelRecord = new PointRecord("2", "Miguel", TEAM_ID, generatePoints(2));
  const thirtyOneDaysAgo = new Date(new Date().setDate(new Date().getDate() - 31));
  for (let i = 0; i < 50; i++) {
    miguelRecord.addPoint(new Point(thirtyOneDaysAgo));
  }
  fakeDBGateway.save(miguelRecord);

  getLeaderboardUseCase = new GetLeaderboardUseCase(fakeDBGateway, new TeamsGatewayImpl());
});
test("Should return leaderboard in desc order", async () => {
  const adapter = new TestAdapter(async (context) => {
    const response = await getLeaderboardUseCase.get(context);
    expect(response).toContain("Team Fake");
    // Carlos should be on the top of leaderboard
    expect(response.indexOf("Carlos") < response.indexOf("Miguel")).toBeTruthy();
    expect(response.indexOf("Miguel") < response.indexOf("Jeff")).toBeTruthy();
  });
  await adapter.send("leaderboard");
});

test("Should not duplicate people on the leaderboard", async () => {
  const adapter = new TestAdapter(async (context) => {
    const response = await getLeaderboardUseCase.get(context);
    expect(response.indexOf("Carlos") === response.lastIndexOf("Carlos")).toBeTruthy();
  });
  await adapter.send("leaderboard");
});

test("Should only show points in 30 day period", async () => {
  const adapter = new TestAdapter(async (context) => {
    const response = await getLeaderboardUseCase.get(context);
    expect(response.indexOf("Carlos") === response.lastIndexOf("Carlos")).toBeTruthy();
  });
  await adapter.send("leaderboard");
});
