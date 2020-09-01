import { FakeKudoDbGateway }  from '../../testHelpers/fakeDBGateway'
import { KudoRecord } from '../../src/kudo/KudoRecord';
import { Kudo } from '../../src/kudo/Kudo';
import { GetLeaderboardUseCase } from '../../src/kudo/GetLeaderboardUseCase'
import { FakeTeamsGateway } from '../../testHelpers/fakeTeamsGateway';
import { TurnContext, TestAdapter } from 'botbuilder';


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

    const getLeaderboardUseCase = new GetLeaderboardUseCase(fakeDBGateway, new FakeTeamsGateway("3"));

    const adapter = new TestAdapter(async (context) => {
        const response = await getLeaderboardUseCase.getLeaderboard(context);
        expect(response).toBe(`Team Delta\nCarlos has 3 points.\nMiguel has 2 points.\nJeff has 1 point.`)
   });
   adapter.send("leaderboard");
})