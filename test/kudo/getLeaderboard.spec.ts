import { FakeKudoDbGateway }  from '../../testHelpers/fakeDBGateway'
import { KudoRecord } from '../../src/kudo/KudoRecord';
import { Kudo } from '../../src/kudo/Kudo';
import { GetLeaderboardUseCase } from '../../src/kudo/GetLeaderboardUseCase'


test("Should return leaderboard in desc order", () => {
    const fakeDBGateway = new FakeKudoDbGateway();

    let kudoRecord = new KudoRecord("1", "Carlos", "3");
    kudoRecord.addKudo(new Kudo("Great job!", "2", new Date, 1));
    kudoRecord.addKudo(new Kudo("Great job again!", "2", new Date, 1));
    kudoRecord.addKudo(new Kudo("Great job a third time!", "2", new Date, 1));
    fakeDBGateway.save(kudoRecord);

    kudoRecord = new KudoRecord("3", "Jeff", "3");
    kudoRecord.addKudo(new Kudo("Great job!", "1", new Date, 1));
    fakeDBGateway.save(kudoRecord);

    kudoRecord = new KudoRecord("2", "Miguel", "3");
    kudoRecord.addKudo(new Kudo("Great job!", "3", new Date, 1));
    kudoRecord.addKudo(new Kudo("Great job again!", "3", new Date, 1));
    fakeDBGateway.save(kudoRecord);

    const getLeaderboardUseCase = new GetLeaderboardUseCase(fakeDBGateway);

    const response = getLeaderboardUseCase.getLeaderboard("3");
    expect(response).toBe(`Carlos has 3 points.\nMiguel has 2 points.\nJeff has 1 point.`)
})