export class Hero {
    name: string;
    gamesPlayed: number;

    // ? ban rate/total games banned ?

    // ? portrait URL ?
    // ? description/pros/cons ? cf icyveins

    winRate?: number = 0;

    winRatePerMap?: { [key: string]: number } = null;

    winRatePerDuo?: { [key: string]: number } = null;

    winRatePerMatchup?: { [key: string]: number } = null;

    constructor(
        name: string,
        gamesPlayed: number,
        winRate: number,
        winRatePerMap: { [key: string]: number } = null,
        winRatePerDuo: { [key: string]: number } = null,
        winRatePerMatchup: { [key: string]: number } = null
    ) {
        this.name = name;
        this.gamesPlayed = gamesPlayed;
        this.winRate = winRate;
        this.winRatePerMap = winRatePerMap;
        this.winRatePerDuo = winRatePerDuo;
        this.winRatePerMatchup = winRatePerMatchup;
    }
}
