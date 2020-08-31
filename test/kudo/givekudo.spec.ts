import { GiveKudoUseCase } from '../../src/kudo/GiveKudoUseCase'
import { KudoRecordDBGateway } from '../../src/kudo/KudoRecordDBGateway';
import { KudoRecord, NoopKudoRecord } from '../../src/kudo/KudoRecord';

class FakeKudoDbGateway implements KudoRecordDBGateway {
  private kudos: KudoRecord[] = []

  save(boardId: string, kudoRecord: KudoRecord): void {
    this.kudos.push(kudoRecord)
  }
  findRecord(personId: string, boardId: string): KudoRecord {
    return this.kudos.find(kudo => kudo.personId === personId) || new NoopKudoRecord("", "");
  }
}

test('Saves kudo record to given datastore', () => {
  const fakeKudoDb = new FakeKudoDbGateway();
  const giveKudoUseCase = new GiveKudoUseCase(fakeKudoDb);
  giveKudoUseCase.giveKudo("1", "2", 5, "Thanks", "3");
  expect(fakeKudoDb.findRecord("1", "2").score).toBe(5);
});

test('Updates kudo record when one exists', () => {
  const fakeKudoDb = new FakeKudoDbGateway();
  const giveKudoUseCase = new GiveKudoUseCase(fakeKudoDb);

  giveKudoUseCase.giveKudo("1", "2", 5, "Thanks", "3");
  giveKudoUseCase.giveKudo("1", "2", 2, "Thank you again", "3");
  giveKudoUseCase.giveKudo("1", "2", -3, "What you did was uncool", "3");

  expect(fakeKudoDb.findRecord("1", "2").score).toBe(4);
});