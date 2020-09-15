import { PointRecordFileDbGateway } from "../src/db/PointRecordFileDbGateway";
import { PointRecord } from "../src/point/PointRecord";
import * as fs from "fs";
import { Point } from "../src/point/Point";
import { generatePoints } from "../testHelpers/fakeDBGateway";

test("Should not save duplicates", () => {
  const db = new PointRecordFileDbGateway("test.json");
  db.save(new PointRecord("1", "TEST", "0", generatePoints(5)));
  db.save(new PointRecord("1", "TEST", "0", generatePoints(5)));
  db.save(new PointRecord("1", "TEST", "0", generatePoints(5)));
  db.save(new PointRecord("1", "TEST", "0", generatePoints(5)));

  expect(db.getAllRecords("0").length).toBe(1);
});

test("Should instantiate with non-empty test.json", () => {
  const tmp = new PointRecordFileDbGateway("test.json");
  tmp.save(new PointRecord("1", "TEST", "0", generatePoints(5)));
  tmp.save(new PointRecord("1", "TEST", "0", generatePoints(5)));

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
