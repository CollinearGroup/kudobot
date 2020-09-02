import { KudoRecord } from "./KudoRecord";

export interface KudoRecordDBGateway {
  save(kudoRecord: KudoRecord): void;
  findRecord(personId: string, boardId: string): KudoRecord;
  getAllRecords(teamId: string): KudoRecord[];
}
