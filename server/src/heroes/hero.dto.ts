

export class Hero {
    name : string;
    gamesPlayed : number;

    // ? ban rate/total games banned ?

    winRate : number;

    winRatePerMap : { [key: string] : number }

    winRatePerDuo : { [key : string] : number}

    winRatePerMatchup : { [key : string] : number}

    constructor(name: string,
                gamesPlayed : number,
                winRatePerMap : { [key: string] : number },
                winRatePerDuo : { [key: string] : number },
                winRatePerMatchup : { [key: string] : number }) {
        this.name = name;
        this.gamesPlayed = gamesPlayed;
        this.winRatePerMap = winRatePerMap;
        this.winRatePerDuo = winRatePerDuo;
        this.winRatePerMatchup = winRatePerMatchup;
    }
}
