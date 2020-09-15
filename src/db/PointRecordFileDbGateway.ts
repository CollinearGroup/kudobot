import { PointRecordDBGateway } from "../point/PointRecordDBGateway";
import { PointRecord, NoopPointRecord } from "../point/PointRecord";
import * as fs from "fs";

export class PointRecordFileDbGateway implements PointRecordDBGateway {
  private pointRecords: PointRecord[];

  constructor(private localPointStoreFile = "boards.json") {
    if (!fs.existsSync(this.localPointStoreFile)) {
      fs.writeFileSync(
        this.localPointStoreFile,
        JSON.stringify(new Array<PointRecord>())
      );
      this.pointRecords = [];
      return;
    }

    const parsedObjects = JSON.parse(
      fs.readFileSync(this.localPointStoreFile).toString()
    );
    this.pointRecords = parsedObjects.map((object) => {
      return new PointRecord(
        object.personId,
        object.personName,
        object.teamId,
        object.points,
        object.date
      );
    });
  }

  public findRecord(personId: string, teamId: string): PointRecord {
    return (
      this.pointRecords.find(
        (record) => record.teamId == teamId && record.personId == personId
      ) || new NoopPointRecord()
    );
  }

  public save(pointRecord: PointRecord) {
    if (this.findRecord(pointRecord.personId, pointRecord.teamId).exists()) {
      this.pointRecords = this.pointRecords.filter(
        (each) => !each.equals(pointRecord)
      );
    }
    this.pointRecords.push(pointRecord);
    fs.writeFileSync(
      this.localPointStoreFile,
      JSON.stringify(this.pointRecords)
    );
  }

  public getAllRecords(teamId: string): Array<PointRecord> {
    return this.pointRecords.filter((record) => record.teamId == teamId);
  }
}
