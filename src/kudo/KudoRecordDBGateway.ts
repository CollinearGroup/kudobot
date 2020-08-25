import { KudoRecord } from "./KudoRecord";

export interface KudoRecordDBGateway {
     save(kudoRecord: KudoRecord);
     getRecord(personId: string, boardId: string);
}