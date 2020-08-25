import { ChannelAccount } from "botbuilder";

export class Kudo {
    constructor(
        public text: string,
        public giver: string,
        public timestamp: Date,
        public value: number = 1){ }
}