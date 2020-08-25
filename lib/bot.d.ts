import { ActivityHandler } from 'botbuilder';
import { KudoStore } from './db/Kudostore';
import { GetKudoHelpUseCase } from './kudo/GetKudoHelpUseCase';
export declare class KudoBot extends ActivityHandler {
    private testing;
    private botName;
    private kudoStore;
    private getKudoHelpUseCase;
    constructor(botName: string, kudoStore: KudoStore, getKudoHelpUseCase: GetKudoHelpUseCase);
    private getAtCmds;
    private getMentions;
    private handleAtMentions;
    private handleAtCmds;
    private getStuffAfter;
    private getTargets;
}
