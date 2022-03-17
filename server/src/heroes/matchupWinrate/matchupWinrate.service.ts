const puppeteer = require("puppeteer");
import { Injectable } from "@nestjs/common";
import { Browser, ElementHandle, Page } from "puppeteer";
import { Hero } from "../dto/hero.dto";
import {
    HeroScrapingHelper,
    Sorting,
} from "../scraping/heroScrapingHelper.service";

@Injectable()
export class MatchupWinrateService {
    constructor(private readonly heroScraping: HeroScrapingHelper) {}

    async getMatchupWinrates(
        allyTeam: Array<string>,
        enemyTeam: Array<string>,
        minSampleSize: number = 30,
        selectionRange: number = 8
    ): Promise<Array<Hero>> {
        let heroChoices = [];

        const browser = await puppeteer.launch();
        let samplesPerHero = 2;

        for await (const enemyName of enemyTeam) {
            console.log("Fetching choices for hero ", );

            if (enemyName !== null) {
                const { bestChoices, worstChoices } =
                    await this.getMatchupsForHero(
                        enemyName,
                        browser,
                        selectionRange,
                        minSampleSize,
                        allyTeam,
                        enemyTeam
                    );

                // get x best/worst elements for each ally
                for (let j = 0; j < samplesPerHero; j++)
                    heroChoices.push(bestChoices[j]);
                for (let j = 0; j < samplesPerHero; j++)
                    heroChoices.push(worstChoices[j]);
            }
        }

        console.log("Closing browser");
        await browser.close();

        return heroChoices;
    }

    async getMatchupsForHero(
        heroName: string,
        browser: Browser,
        selectionRange: number = 8,
        minSampleSize: number = 30,
        allyTeam: Array<string> = [],
        enemyTeam: Array<string> = []
    ): Promise<any> {
        let allHeroStats = [];
        let bestChoices = [];
        let worstChoices = [];

        const page = await browser.newPage();
        // ! hero name needs to be properly written and capital letters at the start of words
        const urlString = `https://www.hotslogs.com/Sitewide/TalentDetails?Hero=${heroName}&Tab=winRateVsOtherHeroes`;
        await page.goto(urlString);

        // make sure you get the correct table id and send it to the function
        let tableToScrape = await page.$("#DataTables_Table_0");

        allHeroStats = await this.heroScraping.scrapeGenericTable(
            tableToScrape,
            3,
            minSampleSize
        );

        // exclude already picked heroes
        allHeroStats = allHeroStats.filter(
            (hero) =>
                allyTeam.find((allyName) => allyName === hero.name) === undefined
        );
        allHeroStats = allHeroStats.filter(
            (hero) =>
                enemyTeam.find((enemyName) => enemyName === hero.name) === undefined
        );

        // * inverting the sorting because here less is more (enemy POV)
        // get only the best choices
        bestChoices = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Descending,
            selectionRange
        );
        // get only the worst choices
        worstChoices = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Ascending,
            selectionRange
        );

        // * also here we are inverting because we get the matchups from the opposite POV
        // convert base winrate to per-hero
        for (let i = 0; i < bestChoices.length; i++) {
            const hero = bestChoices[i];
            hero.winRatePerDuo[heroName] = 100.0 - hero.winRate;
            hero.winRate = 100.0 - hero.winRate;
        }
        for (let i = 0; i < worstChoices.length; i++) {
            const hero = worstChoices[i];
            hero.winRatePerDuo[heroName] = 100.0 - hero.winRate;
            hero.winRate = 100.0 - hero.winRate;
        }

        return { bestChoices, worstChoices };
    }
}
