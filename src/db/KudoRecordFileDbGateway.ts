import { KudoRecordDBGateway } from "../kudo/KudoRecordDBGateway";
import { KudoRecord, NoopKudoRecord } from "../kudo/KudoRecord";
import * as fs from "fs";

export class KudoRecordFileDbGateway implements KudoRecordDBGateway {
  private kudoRecords: KudoRecord[];

  constructor(private localKudoStoreFile = "boards.json") {
    if (!fs.existsSync(this.localKudoStoreFile)) {
      fs.writeFileSync(
        this.localKudoStoreFile,
        JSON.stringify(new Array<KudoRecord>())
      );
      this.kudoRecords = [];
      return;
    }

    const parsedObjects = JSON.parse(
      fs.readFileSync(this.localKudoStoreFile).toString()
    );
    this.kudoRecords = parsedObjects.map((object) => {
      return new KudoRecord(
        object.personId,
        object.personName,
        object.teamId,
        object.kudos
      );
    });
  }

  public findRecord(personId: string, teamId: string): KudoRecord {
    return (
      this.kudoRecords.find(
        (record) => record.teamId == teamId && record.personId == personId
      ) || new NoopKudoRecord()
    );
  }

  public save(kudoRecord: KudoRecord) {
    if (this.findRecord(kudoRecord.personId, kudoRecord.teamId).exists()) {
      this.kudoRecords = this.kudoRecords.filter(
        (each) => !each.equals(kudoRecord)
      );
    }
    this.kudoRecords.push(kudoRecord);
    fs.writeFileSync(this.localKudoStoreFile, JSON.stringify(this.kudoRecords));
  }

  public getAllRecords(teamId: string): Array<KudoRecord> {
    return this.kudoRecords.filter((record) => record.teamId == teamId);
  }
}
