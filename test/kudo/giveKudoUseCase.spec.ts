import { GiveKudoUseCase } from "../../src/kudo/GiveKudoUseCase";
import { FakeKudoDbGateway } from "../../testHelpers/fakeDBGateway";

test("Saves kudo record to given datastore", () => {
  const fakeKudoDb = new FakeKudoDbGateway();
  const giveKudoUseCase = new GiveKudoUseCase(fakeKudoDb);
  giveKudoUseCase.giveKudo("1", "Mark", "2");
  expect(fakeKudoDb.findRecord("1", "2").kudos).toBe(1);
});

test("Updates kudo record when one exists", () => {
  const fakeKudoDb = new FakeKudoDbGateway();
  const giveKudoUseCase = new GiveKudoUseCase(fakeKudoDb);

  giveKudoUseCase.giveKudo("1", "Mark", "2");
  giveKudoUseCase.giveKudo("1", "Mark", "2");

  expect(fakeKudoDb.findRecord("1", "2").kudos).toBe(2);
});
