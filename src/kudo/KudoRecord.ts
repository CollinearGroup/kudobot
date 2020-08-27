import { Kudo } from "./Kudo";
import { Activity } from "botbuilder";

export class KudoRecord{
    constructor(
        public personId: string,
        public personName: string)
    {
        this.lastKudoCleanup = new Date(0);
    }
    public kudos: Array<Kudo> = [];
    private lastKudoCleanup: Date;
    private lastCalcScore =0;
    get score() {
        this.cleanOldKudos();
        return this.lastCalcScore;
    }
    
    addKudo(kudo: Kudo){
        this.kudos.push(kudo);        
        this.updateScore();
        return this;
    }
    importKudos(kudos:Array<Kudo>){
        for (const kudo of kudos){
            kudo.timestamp = new Date(kudo.timestamp);
            this.kudos.push(kudo);
        }
        this.updateScore();
    }
    private calcScore() {
        let total = 0;
        for (const kudo of this.kudos){
            total += kudo.value;
        }        
        return total;
    }
    
    updateScore(){
        this.lastCalcScore = this.calcScore();
    }

    forceCleanOldKudos(): string{
        return this.cleanOldKudos(true);
    }

    private cleanOldKudos(forceClean:boolean = false): string{
        const daysToKeep = 30;
        const cleanFrequency = 1/(24*12); // Every 5 minutes -- In days
        const currentTime = new Date();
        if (!forceClean && this.calcDaysSince(currentTime, this.lastKudoCleanup) < cleanFrequency){
            return;
        }
        let oldKudos: Array<Kudo> = [];
        
        for (const kudo of this.kudos){           
            if (this.calcDaysSince(currentTime, kudo.timestamp) > daysToKeep){
                oldKudos.push(kudo);
            } 
        }
        for (const kudo of oldKudos){
            const oldKudoIndex = this.kudos.indexOf(kudo);
            this.kudos.splice(oldKudoIndex,1);
        }
        this.lastKudoCleanup = currentTime;
        this.updateScore();
        return `${oldKudos.length} old kudos removed from ${this.personName}.<br>`
    }

    private calcDaysSince(date1: Date, date2: Date):number{
            const timeDiff = date1.getTime() - date2.getTime(); 
            const DiffInDays = timeDiff / (3600 * 24) / 1000;
            return DiffInDays;
    }
}