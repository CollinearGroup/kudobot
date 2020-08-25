import { KudoRecord } from './KudoRecord';
import { KudoRecordDBGateway } from './KudoRecordDBGateway';
import { Kudo } from './Kudo';

export class GiveKudoUseCase {

    private kudoRecordDb: KudoRecordDBGateway;

    public giveKudo(personTeamsId: string, teamId: string, kudos: number, text: string, giverId: string): KudoRecord {
        const kudoRecord: KudoRecord = this.kudoRecordDb.getRecord(personTeamsId, teamId);
        kudoRecord.addKudo(new Kudo(text, giverId, new Date(), kudos));
        this.kudoRecordDb.save(kudoRecord);
        return kudoRecord;
    }

}