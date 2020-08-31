import { KudoRecord } from "./KudoRecord";

export interface KudoRecordDBGateway {
     save(boardId: string, kudoRecord: KudoRecord): void;
     findRecord(personId: string, boardId: string): KudoRecord;
}