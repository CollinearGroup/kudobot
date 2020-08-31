import { KudoRecord } from './KudoRecord';
import { KudoRecordDBGateway } from './KudoRecordDBGateway';
import { Kudo } from './Kudo';

export class GiveKudoUseCase {

    constructor(private kudoRecordDb: KudoRecordDBGateway) {}

    public giveKudo(personTeamsId: string, teamId: string, kudos: number, text: string, giverId: string): KudoRecord {
        let kudoRecord: KudoRecord = this.kudoRecordDb.findRecord(personTeamsId, teamId);
        if (!kudoRecord.exists()) {
            kudoRecord = new KudoRecord(personTeamsId, teamId);
        }
        kudoRecord.addKudo(new Kudo(text, giverId, new Date(), kudos));
        this.kudoRecordDb.save(teamId, kudoRecord);
        return kudoRecord;
    }

}