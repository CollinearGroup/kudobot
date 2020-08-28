const fs = require('fs');

import {Activity, ChannelAccount, TurnContext, TeamsInfo } from 'botbuilder';
import { Board } from '../kudo/KudoBoard';
import { KudoRecord } from '../kudo/KudoRecord';
import { Kudo } from '../kudo/Kudo';
import { UsefulMessageData } from '../bot/UsefulMessageData'
// class for the actual Kudo given and all its related information






export class KudoStore {
    private boards: Map<string, Board>;
    private needSave = false;
    private localKudoStoreFile = "boards.json";
    private saveInterval: NodeJS.Timeout;
    constructor(){
        this.tryLoad(this.localKudoStoreFile);
        this.startSaverClock();
    }
    leaderboard(msgData:UsefulMessageData): Board{
        let board = this.getBoard(msgData.boardId);
        board.kudoRecords = this.boards.get(msgData.boardId).kudoRecords.sort((a:KudoRecord, b:KudoRecord)=>{
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

    setName(boardId: string, teamName: string):void{
        if (this.boards.has(boardId)){
            this.boards.get(boardId).name = teamName;
        }
    }

    private tryLoad(fileLoc: string){
        // TODO: actually make it load from a database
        this.boards = new Map<string, Board>();
        fs.readFile(this.localKudoStoreFile, 'utf8', function(err, data){
            if(data){
                const boardsData = JSON.parse(data);
                for (const mapPair of boardsData){
                    const boardId = mapPair[0];
                    const board: Board = mapPair[1];
                    let newRecords:Array<KudoRecord> = [];
                    // Not actualy an official board object but its close enough
                    if (board.kudoRecords){
                        for (const record of board.kudoRecords){
                            let newRecord = new KudoRecord(record.personName, record.personName);
                            newRecord.importKudos(record.kudos);
                            newRecords.push(newRecord);
                        }
                    }                   
                    if (!this.boards.has(boardId)){
                        let newBoard = new Board(newRecords);
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
    
    clearBoard(boardId: string){
        this.boards.delete(boardId);
    }

    getBoard(boardId: string){
        if (!this.boards.has(boardId)){
            this.boards.set(boardId, new Board());
        }
        return this.boards.get(boardId);
    }

    genDummyData(numPeople:number, msgData:UsefulMessageData):string{
        const firstNames = ["James", "Mary", "John", "Patricia", "Robert", "Michael", "William", "David", "Richard", "Joseph", "Thomas", "Charles", "Christopher", "Daniel", "Matthew", "Anthony", "Jennifer", "Linda", "Elizebeth", "Barbra", "Susan", "Jessica", "Sarah", "Karen"];
        const lastNames = ["Smith", "Johnson", "Williams", "Brown", "Jones", "Miller", "Davis", "Garcia", "Rodriguez", "Wilson", "Martinez", "Anderson", "Taylor", "Hernandez", "Moore", "Martin", "Jackson", "Thompson", "White", "Lopez", "Lee", "Gonzalez"];
        let output = ""            
        for (let i = 0; i < numPeople; i++){
            const name = `${this.takeRnd(firstNames)} ${this.takeRnd(lastNames)}`;
            this.getBoard(msgData.boardId);
            const person = this.getPerson(`dummy_${this.getRnd(5000,5000000)}`, name, msgData.boardId);
            const kudosToMake = this.getRnd(0,42);
            for (let k = 0; k < kudosToMake; k++){
                let oldDate = new Date();
                oldDate.setDate(oldDate.getDay()-this.getRnd(0,60));
                person.addKudo(new Kudo(msgData.text, msgData.from, oldDate, ));
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
    giveKudos(accts:Array<ChannelAccount>, msgData:UsefulMessageData, value:number = 1): Array<KudoRecord>{
        let updatedPeople: Array<KudoRecord> = [];
        for (const acct of accts){
            const boardId = msgData.boardId
            const person = this.getPerson(acct.id, acct.name, boardId).addKudo(new Kudo(msgData.text, msgData.from, new Date(), value));
            updatedPeople.push(person);
        }
        if (updatedPeople.length >0){
            this.needSave = true;
        }
        return updatedPeople;
    }

    // if people gets too big -- search time might suck 
    private getPerson(id:string, name:string, boardId:string){
        for(const person of this.boards.get(boardId).kudoRecords){
            if (person.personId == id){
                return person;
            }
        }
        // No person by that name was found. 
        const newPerson = new KudoRecord(id, name);
        this.boards.get(boardId).kudoRecords.push(newPerson);
        return newPerson; 
    }

    // people is a list of people to generate a leaderboard for 
    // numRecords is how many people from your people list to output (default = all records)
    // includeZeros allows you to specify if you'd like to include people from your list with a score of zero
    genLeaderboardText(people: Array<KudoRecord>, numRecords: number = people.length, includeZeros: boolean = false){
        let boardText = ""; 
        for (const person of people){
            if (!includeZeros && person.score == 0){
                continue;
            }
            const plural = person.score == 1? "":"s";                        
            boardText += `   ${person.personName} has ${person.score} point${plural}. <br>`
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
