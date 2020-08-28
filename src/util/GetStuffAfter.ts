export function getStuffAfter(keyWord:string, text:string):Array<string>{
    // Grab everything after key word
    let brokenText = text.split(keyWord);
    if (brokenText.length<2){
        return [];
    } 
    return brokenText[1].split(" ");
}