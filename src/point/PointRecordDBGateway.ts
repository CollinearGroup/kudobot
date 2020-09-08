import { PointRecord } from "./PointRecord";

export interface PointRecordDBGateway {
  save(pointRecord: PointRecord): void;
  findRecord(personId: string, boardId: string): PointRecord;
  getAllRecords(teamId: string): PointRecord[];
}
