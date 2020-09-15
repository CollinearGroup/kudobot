import { PointRecordFileDbGateway } from "../src/db/PointRecordFileDbGateway";
import { PointRecord } from "../src/point/PointRecord";
import * as fs from "fs";

test("Should not save duplicates", () => {
  const db = new PointRecordFileDbGateway("test.json");
  db.save(new PointRecord("1", "TEST", "0", 5, new Date()));
  db.save(new PointRecord("1", "TEST", "0", 5, new Date()));
  db.save(new PointRecord("1", "TEST", "0", 5, new Date()));
  db.save(new PointRecord("1", "TEST", "0", 5, new Date()));

  expect(db.getAllRecords("0").length).toBe(1);
});

test("Should instantiate with non-empty test.json", () => {
  const tmp = new PointRecordFileDbGateway("test.json");
  tmp.save(new PointRecord("1", "TEST", "0", 5, new Date()));
  tmp.save(new PointRecord("1", "TEST", "0", 5, new Date()));

  const testDbAdapter = new PointRecordFileDbGateway("test.json");

  expect(testDbAdapter.getAllRecords("0").length).toBe(1);
});

afterEach(() => {
  fs.unlink("test.json", (err) => {
    if (err) {
      console.error(err);
    }
  });
});
