import { GivePointUseCase } from "../../src/point/GivePointUseCase";
import { FakePointDbGateway } from "../../testHelpers/fakeDBGateway";

test("Saves point record to given datastore", () => {
  const fakePointDb = new FakePointDbGateway();
  const givePointUseCase = new GivePointUseCase(fakePointDb);
  givePointUseCase.givePoint("1", "Mark", "2");
  expect(fakePointDb.findRecord("1", "2").points).toBe(1);
});

test("Updates point record when one exists", () => {
  const fakePointDb = new FakePointDbGateway();
  const givePointUseCase = new GivePointUseCase(fakePointDb);

  givePointUseCase.givePoint("1", "Mark", "2");
  givePointUseCase.givePoint("1", "Mark", "2");

  expect(fakePointDb.findRecord("1", "2").points).toBe(2);
});
