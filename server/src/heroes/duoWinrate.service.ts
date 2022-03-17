const puppeteer = require("puppeteer");
import { Injectable } from "@nestjs/common";
import { Browser, ElementHandle, Page } from "puppeteer";
import { Hero } from "./hero.dto";
import { HeroScrapingHelper, Sorting} from "./scraping/heroScrapingHelper.service";

@Injectable()
export class DuoWinrateService {
    constructor(private readonly heroScraping: HeroScrapingHelper) {}

    async getSynergyWinrates(
        allyTeam: Array<Hero>,
        minSampleSize: number = 30,
        selectionRange: number = 8
    ): Promise<Array<Hero>> {
        let heroChoices = [];

        let bestChoicesArray = []; // * array of arrays of best heroes for each ally member
        let worstChoicesArray = []; // * array of arrays of worst heroes for each ally member

        const browser = await puppeteer.launch();

        for await (const allyHero of allyTeam) {
            console.log("Fetching choices for hero ", allyHero.name);

            if (allyHero !== null) {
                const { bestChoices, worstChoices } =
                    await this.getChoicesWithHero(
                        allyHero.name,
                        browser,
                        selectionRange,
                        minSampleSize,
                        allyTeam
                    );

                // * for each allied hero, push synergies to best/worst choices array
                bestChoicesArray.push(bestChoices);
                worstChoicesArray.push(worstChoices);
            }
        }

        // * get x best/worst elements for each ally
        let samplesPerHero = 2;
        // ! you're supposed to have {selectionRange} items in here so we should be fine with this
        // ! but be careful
        for (let i = 0; i < bestChoicesArray.length; i++) {
            for (let j = 0; j < samplesPerHero; j++) {
                heroChoices.push(bestChoicesArray[i][j]);
            }
        }
        for (let i = 0; i < worstChoicesArray.length; i++) {
            for (let j = 0; j < samplesPerHero; j++) {
                heroChoices.push(worstChoicesArray[i][j]);
            }
        }
        console.log("Closing browser");
        await browser.close();

        return heroChoices;
    }

    async getChoicesWithHero(
        heroName: string,
        browser: Browser,
        selectionRange: number = 8,
        minSampleSize: number = 30,
        allyTeam : Array<Hero> = []
    ): Promise<any> {
        let allHeroStats = [];
        let bestChoices = [];
        let worstChoices = [];

        const page = await browser.newPage();
        // ! hero name needs to be properly written and capital letters at the start of words
        const urlString = `https://www.hotslogs.com/Sitewide/TalentDetails?Hero=${heroName}&Tab=winRateWithOtherHeroes`;
        await page.goto(urlString);

        // * make sure you get the correct table id and send it to the function
        let tableToScrape = await page.$("#DataTables_Table_1");

        allHeroStats = await this.heroScraping.scrapeGenericTable(
            tableToScrape,
            3,
            minSampleSize
        );

        // * exclude already picked heroes
        allHeroStats = allHeroStats.filter(hero => allyTeam.find(ally => ally.name === hero.name) === undefined);

        bestChoices = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Ascending,
            selectionRange
        );
        worstChoices = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Descending,
            selectionRange
        );

        // * convert base winrate to per-hero
        for (let i = 0; i < bestChoices.length; i++) {
            const hero = bestChoices[i];
            hero.winRatePerDuo[heroName] = hero.winRate;
        }
        for (let i = 0; i < worstChoices.length; i++) {
            const hero = worstChoices[i];
            hero.winRatePerDuo[heroName] = hero.winRate;
        }

        return { bestChoices, worstChoices };
    }
}
