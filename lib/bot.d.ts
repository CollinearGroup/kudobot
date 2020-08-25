import { ActivityHandler } from 'botbuilder';
export declare class KudoBot extends ActivityHandler {
    private testing;
    private botName;
    private kudoStore;
    constructor();
    private getAtCmds;
    private getMentions;
    private handleAtMentions;
    private handleAtCmds;
    private getStuffAfter;
    private getTargets;
}
