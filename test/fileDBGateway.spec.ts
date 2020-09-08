import { PointRecordFileDbGateway } from "../src/db/PointRecordFileDbGateway";
import { PointRecord } from "../src/point/PointRecord";
import * as fs from "fs";

test("Should not save duplicates", () => {
  const pointRecordFileDb = new PointRecordFileDbGateway("test.json");
  pointRecordFileDb.save(new PointRecord("1", "TEST", "0", 5));
  pointRecordFileDb.save(new PointRecord("1", "TEST", "0", 5));
  pointRecordFileDb.save(new PointRecord("1", "TEST", "0", 5));
  pointRecordFileDb.save(new PointRecord("1", "TEST", "0", 5));

  expect(pointRecordFileDb.getAllRecords("0").length).toBe(1);
});
afterAll(() => {
  fs.unlink("test.json", (err) => {
    if (err) {
      console.error(err);
    }
  });
});
