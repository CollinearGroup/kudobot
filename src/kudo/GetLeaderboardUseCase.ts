import { KudoRecordDBGateway } from "./KudoRecordDBGateway";
export class GetLeaderboardUseCase
{
    constructor (private kudoRecordDBGateway: KudoRecordDBGateway){}
    
    getLeaderboard(teamId:string){
        const allRecords = this.kudoRecordDBGateway.getAllRecords(teamId);
        const sortedAllRecords = allRecords.sort((a, b)=> a.score>b.score ? -1:1);//desc
        return sortedAllRecords.map(record=>`${record.personName} has ${record.score} point${record.score>1?'s':''}.`).join(`\n`);       
    }
}