import { PointRecordDBGateway } from "../src/point/PointRecordDBGateway";
import { PointRecord, NoopPointRecord } from "../src/point/PointRecord";
import { Point } from "../src/point/Point";

export class FakePointDbGateway implements PointRecordDBGateway {
  private pointRecords: PointRecord[] = [];

  save(pointRecord: PointRecord): void {
    if (this.findRecord(pointRecord.personId, pointRecord.teamId).exists()) {
      this.pointRecords = this.pointRecords.filter((each) => !each.equals(pointRecord));
    }
    this.pointRecords.push(pointRecord);
  }

  findRecord(personId: string, teamId: string): PointRecord {
    return (
      this.pointRecords.find((pointRecord) => pointRecord.personId === personId) ||
      new NoopPointRecord()
    );
  }

  getAllRecords(teamId: string) {
    return this.pointRecords.filter((record) => record.teamId == teamId);
  }
}

export function generatePoints(num: number): Point[] {
  const arr = [];
  for (let i = 0; i < num; i++) {
    arr.push(new Point());
  }
  return arr;
}
