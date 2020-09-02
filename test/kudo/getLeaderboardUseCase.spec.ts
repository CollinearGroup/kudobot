import { FakeKudoDbGateway } from "../../testHelpers/fakeDBGateway";
import { KudoRecord } from "../../src/kudo/KudoRecord";
import { GetLeaderboardUseCase } from "../../src/kudo/GetLeaderboardUseCase";
import { FakeTeamsGateway } from "../../testHelpers/fakeTeamsGateway";
import { TestAdapter } from "botbuilder";

test("Should return leaderboard in desc order", async () => {
  const fakeDBGateway = new FakeKudoDbGateway();

  let kudoRecord = new KudoRecord("1", "Carlos", "3", 3);
  fakeDBGateway.save(kudoRecord);

  kudoRecord = new KudoRecord("3", "Jeff", "3", 1);
  fakeDBGateway.save(kudoRecord);

  kudoRecord = new KudoRecord("2", "Miguel", "3", 2);
  fakeDBGateway.save(kudoRecord);

  const getLeaderboardUseCase = new GetLeaderboardUseCase(
    fakeDBGateway,
    new FakeTeamsGateway("3")
  );

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
