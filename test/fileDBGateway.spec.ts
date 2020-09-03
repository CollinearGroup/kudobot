import { KudoRecordFileDbGateway } from "../src/db/KudoRecordFileDbGateway";
import { KudoRecord } from "../src/kudo/KudoRecord";
import * as fs from "fs";

test("Should not save duplicates", () => {
  const kudoRecordFileDb = new KudoRecordFileDbGateway("test.json");
  kudoRecordFileDb.save(new KudoRecord("1", "TEST", "0", 5));
  kudoRecordFileDb.save(new KudoRecord("1", "TEST", "0", 5));
  kudoRecordFileDb.save(new KudoRecord("1", "TEST", "0", 5));
  kudoRecordFileDb.save(new KudoRecord("1", "TEST", "0", 5));

  expect(kudoRecordFileDb.getAllRecords("0").length).toBe(1);
});
afterAll(() => {
  fs.unlink("test.json", (err) => {
    if (err) {
      console.error(err);
    }
  });
});
