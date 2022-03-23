export class Hero {
    name: string;
    gamesPlayed: number;

    // ? ban rate/total games banned ?

    portraitUrl?: string = "";

    // ? description/pros/cons ? cf icyveins

    role?: string = "";

    winRate?: number = 0;

    winRatePerMap?: { [key: string]: number } = {};

    winRatePerDuo?: { [key: string]: number } = {};

    winRatePerMatchup?: { [key: string]: number } = {};

    constructor(
        name: string,
        gamesPlayed: number,
        winRate: number,
        winRatePerMap: { [key: string]: number } = {},
        winRatePerDuo: { [key: string]: number } = {},
        winRatePerMatchup: { [key: string]: number } = {},
        portraitUrl: string = "",
        role: string = ""
    ) {
        this.name = name;
        this.gamesPlayed = gamesPlayed;
        this.winRate = winRate;
        this.winRatePerMap = winRatePerMap;
        this.winRatePerDuo = winRatePerDuo;
        this.winRatePerMatchup = winRatePerMatchup;
        this.portraitUrl = portraitUrl;
        this.role = role;
    }
}
