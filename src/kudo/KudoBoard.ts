import { KudoRecord } from "./KudoRecord";

export class Board{
    name: string;
    kudoRecords: Array<KudoRecord>;
    constructor(kudoRecords:Array<KudoRecord>= []){
        this.kudoRecords = kudoRecords;
    }
}