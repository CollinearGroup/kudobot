import { FakeKudoDbGateway } from "../../testHelpers/fakeDBGateway";
import { KudoRecord } from "../../src/kudo/KudoRecord";
import { GetLeaderboardUseCase } from "../../src/kudo/GetLeaderboardUseCase";
import { FakeTeamsGateway } from "../../testHelpers/fakeTeamsGateway";
import { TestAdapter } from "botbuilder";

let getLeaderboardUseCase = null;

beforeEach(() => {
  const fakeDBGateway = new FakeKudoDbGateway();
  fakeDBGateway.save(new KudoRecord("1", "Carlos", "3", 3));
  fakeDBGateway.save(new KudoRecord("1", "Carlos", "3", 4));
  fakeDBGateway.save(new KudoRecord("1", "Carlos", "3", 5));

  fakeDBGateway.save(new KudoRecord("3", "Jeff", "3", 1));
  fakeDBGateway.save(new KudoRecord("2", "Miguel", "3", 2));

  getLeaderboardUseCase = new GetLeaderboardUseCase(
    fakeDBGateway,
    new FakeTeamsGateway("3")
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
