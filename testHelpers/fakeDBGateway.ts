import { KudoRecordDBGateway } from '../src/kudo/KudoRecordDBGateway';
import { KudoRecord, NoopKudoRecord } from '../src/kudo/KudoRecord';

export class FakeKudoDbGateway implements KudoRecordDBGateway {
  private kudoRecords: KudoRecord[] = []

  save(kudoRecord: KudoRecord): void {
    this.kudoRecords.push(kudoRecord)
  }
  findRecord(personId: string, boardId: string): KudoRecord {
    return this.kudoRecords.find(kudo => kudo.personId === personId) || new NoopKudoRecord("", "", "");
  }
  getAllRecords(teamId:string){
      return this.kudoRecords.filter(record=>record.teamId==teamId);
  }
}