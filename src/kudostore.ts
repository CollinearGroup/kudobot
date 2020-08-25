const fs = require('fs');

import {Activity, ChannelAccount, TurnContext, TeamsInfo } from 'botbuilder';
// class for the actual Kudo given and all its related information
class Kudo {
    constructor(
        public text: string,
        public giver: ChannelAccount,
        public msgId: string,
        public timestamp: Date,
        public value: number =1){ }
}

class Person{
    constructor(
        public id: string,
        public name: string)
    {
        this.lastKudoCleanup = new Date(0);
    }
    private kudos: Array<Kudo> = [];
    private lastKudoCleanup: Date;
    private lastCalcScore =0;
    get score() {
        this.cleanOldKudos();
        return this.lastCalcScore;
    }
    
    addKudo(srcMsg: Activity, value:number, time:Date = srcMsg.timestamp){
        this.kudos.push(new Kudo(srcMsg.text, srcMsg.from, srcMsg.id, time, value));        
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
        return `${oldKudos.length} old kudos removed from ${this.name}.<br>`
    }

    private calcDaysSince(date1: Date, date2: Date):number{
            const timeDiff = date1.getTime() - date2.getTime(); 
            const DiffInDays = timeDiff / (3600 * 24) / 1000;
            return DiffInDays;
    }
}

class Board{
    name: string;
    people: Array<Person>;
    constructor(people:Array<Person>= []){
        this.people = people;
    }
}

export class KudoStore {
    private boards: Map<string, Board>;
    private needSave = false;
    private localKudoStoreFile = "boards.json";
    private saveInterval: NodeJS.Timeout;
    constructor(){
        this.tryLoad(this.localKudoStoreFile);
        this.startSaverClock();
    }
    leaderboard(msgContext:TurnContext): Board{
        const boardId = this.getTeamId(msgContext.activity);
        this.ensureBoardExists(boardId, msgContext);
        let board = this.boards.get(boardId);
        board.people = this.boards.get(boardId).people.sort((a:Person, b:Person)=>{
            if (a.score > b.score){
                return -1;
            }
            if (a.score < b.score){
                return 1;
            }
            // might consider additional sorting for people with the same score 
            return 0;
            });
        return board;
    }

    private tryLoad(fileLoc: string){
        // TODO: actually make it load from a database
        this.boards = new Map();
        fs.readFile(this.localKudoStoreFile, 'utf8', function(err, data){
            if(data){
                const boardsData = JSON.parse(data);
                for (const mapPair of boardsData){
                    const boardId = mapPair[0];
                    const board = mapPair[1];
                    let newPeople:Array<Person> = [];
                    // Not actualy an official Person object but its close enough
                    for (const person of board.people){
                        let newPerson = new Person(person.id, person.name);
                        newPerson.importKudos(person.kudos);
                        newPeople.push(newPerson);
                    }
                    if (!this.boards.has(boardId)){
                        let newBoard = new Board(newPeople);
                        newBoard.name = board.name;                            
                        this.boards.set(boardId, newBoard);
                    }
                }
            }
        }.bind(this));
    }

    private startSaverClock(){
        // save every 5 minutes? *shrug*
        this.saveInterval = setInterval(this.save, (5*60*1000));
    }

    forceSave(){
        this.needSave = true;
        this.save();
        clearInterval(this.saveInterval);
        this.startSaverClock();
    }

    private save(){
        if(!this.needSave){
            return;
        }
         let data =JSON.stringify(Array.from(this.boards.entries()));
        // TODO: actually make it save to a database... not as flat JSON
        fs.writeFile(this.localKudoStoreFile, data, 'utf8', function(err, data){
            console.log(err); 
        }); 
        this.needSave = false;
    }
    
    clearBoard(srcMsgContext: TurnContext){
        const boardId = this.getTeamId(srcMsgContext.activity);
        this.boards.delete(boardId);
        this.ensureBoardExists(boardId, srcMsgContext);
    }

    genDummyData(numPeople:number, msgContext:TurnContext):string{
        const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Jennifer", "Linda", "Elizebeth", "Barbra", "Susan", "Jessica", "Sarah", "Karen"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez"];
        let output = ""            
        for (let i = 0; i < numPeople; i++){
            const name = `${this.takeRnd(firstNames)} ${this.takeRnd(lastNames)}`;
            const boardId = this.getTeamId(msgContext.activity);
            this.ensureBoardExists(boardId, msgContext);
            const person = this.getPerson(`dummy_${this.getRnd(5000,5000000)}`, name, boardId);
            const kudosToMake = this.getRnd(0,42);
            for (let k = 0; k < kudosToMake; k++){
                let oldDate = new Date();
                oldDate.setDate(oldDate.getDay()-this.getRnd(0,60));
                person.addKudo(msgContext.activity, 1, oldDate);
            }
            output += `${kudosToMake} Kudos created for ${name}. <br>`;                
            output += person.forceCleanOldKudos();
        }
        return output;
    }
     
    // dumb little function to get and remove an item from an array used for dummy data
    // note -- unsafe: will gladly try to take things from an empty array
    private takeRnd(arr:Array<any>){
        const rnd = this.getRnd(0, arr.length-1)
        const retVal = arr[rnd];
        arr.splice(rnd,1);
        return retVal;
    }

    private getRnd(low:number, high:number){
        return Math.floor(Math.random() * high) + low;
    }
    
    // little wrapper for addKudo so you can handle multiple people receiving a kudo from one message 
    giveKudos(accts:Array<ChannelAccount>, msgContext:TurnContext, value:number = 1): Array<Person>{
        let updatedPeople: Array<Person> = [];
        for (const acct of accts){
            const boardId = this.getTeamId(msgContext.activity);
            this.ensureBoardExists(boardId, msgContext);
            const person = this.getPerson(acct.id, acct.name, boardId).addKudo(msgContext.activity, value);
            updatedPeople.push(person);
        }
        if (updatedPeople.length >0){
            this.needSave = true;
        }
        return updatedPeople;
    }

    private ensureBoardExists(boardId: string, msgContext: TurnContext){
        if (!this.boards.has(boardId)){
            const teamDetails = TeamsInfo.getTeamDetails(msgContext);
            let newBoard = new Board();
            teamDetails.then((data)=>{
                newBoard.name = data.name;
            })
            this.boards.set(boardId, newBoard);
        }
    }

    private getTeamId(activity: Activity):string{
        let teamId = activity.channelData;
        if (activity.conversation.conversationType == "personal"){
            // really this shouldn't happen since you cant @ anyone to add kudos but for testing its helpful to be able to
            teamId = teamId.tenant.id;
        }        
        if (activity.conversation.conversationType == "channel"){
            teamId = teamId.team.id.split(":")[1].split("@")[0];
        }
        return teamId;  
        
    }

    // if people gets too big -- search time might suck 
    private getPerson(id:string, name:string, boardId:string){
        for(const person of this.boards.get(boardId).people){
            if (person.id == id){
                return person;
            }
        }
        // No person by that name was found. 
        const newPerson = new Person(id, name);
        this.boards.get(boardId).people.push(newPerson);
        return newPerson; 
    }

    // people is a list of people to generate a leaderboard for 
    // numRecords is how many people from your people list to output (default = all records)
    // includeZeros allows you to specify if you'd like to include people from your list with a score of zero
    genLeaderboardText(people: Array<Person>, numRecords: number = people.length, includeZeros: boolean = false){
        let boardText = ""; 
        for (const person of people){
            if (!includeZeros && person.score == 0){
                continue;
            }
            const plural = person.score == 1? "":"s";                        
            boardText += `   ${person.name} has ${person.score} point${plural}. <br>`
            numRecords--;
            if (numRecords <= 0){
                break;
            }
        }
        if (boardText == ""){
            boardText += `Leaderboard currently empty. Try giving some Kudos!`;
        }
        return boardText;
    }
}
