const puppeteer = require("puppeteer");
import { Injectable } from "@nestjs/common";
import { Browser, ElementHandle, Page } from "puppeteer";
import { Hero } from "../dto/hero.dto";
import {
    GameMode,
    HeroScrapingHelper,
    Sorting,
} from "../scraping/heroScrapingHelper.service";

@Injectable()
export class DuoWinrateService {
    constructor(private readonly heroScraping: HeroScrapingHelper) {}

    async getSynergyWinrates(
        allyTeam: Array<string>,
        enemyTeam: Array<string>,
        minSampleSize: number = 30,
        selectionRange: number = 8
    ): Promise<Array<Hero>> {
        let heroChoices = [];

        const browser = await this.heroScraping.GetBrowser();
        let samplesPerHero = selectionRange;

        for (let i = 0; i < allyTeam.length; i++) {
            const allyName = allyTeam[i];
            console.log("Fetching choices for hero ", allyName);

            if (allyName !== null) {
                const { bestChoices, worstChoices } =
                    await this.getChoicesWithHero(
                        allyName,
                        browser,
                        selectionRange,
                        minSampleSize,
                        allyTeam,
                        enemyTeam
                    );

                // get x best/worst elements for each ally
                if (bestChoices.length < samplesPerHero || worstChoices.length < samplesPerHero) {
                    console.log("Error with choices:");
                    console.log("Best choices ", bestChoices);
                    console.log("Worst choices ", worstChoices);
                    continue;
                }

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

    async getChoicesWithHero(
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

        // * quickmatch by default but you gotta be able to change this
        let gameMode = GameMode.QUICKMATCH;
        console.log("Using game Mode ", gameMode);

        const page = await browser.newPage();
        // ! hero name needs to be properly written and capital letters at the start of words
        const urlString = `https://www.hotslogs.com/Sitewide/TalentDetails?GameMode=${gameMode}&Hero=${heroName}&Tab=winRateWithOtherHeroes`;
        try {
            await page.goto(urlString);
        } catch (error) {
            console.log("Error navigating to page ", error);
            await browser.close();
            // * return an error
            return ({
                bestChoices: [],
                worstChoices: []
            });
        }

        console.log("Got to page, looking for table");
        // make sure you get the correct table id and send it to the function
        let tableToScrape = await page.$("#DataTables_Table_1");

        console.log("Going in with min sample size: ", minSampleSize);

        allHeroStats = await this.heroScraping.scrapeGenericTable(
            tableToScrape,
            3,
            minSampleSize
        );

        console.log("All hero stats before filter: ", allHeroStats.length);

        // exclude already picked heroes
        allHeroStats = allHeroStats.filter(
            (hero) =>
                allyTeam.find((allyName) => allyName === hero.name) ===
                undefined
        );
        allHeroStats = allHeroStats.filter(
            (hero) =>
                enemyTeam.find((enemyName) => enemyName === hero.name) ===
                undefined
        );



        // get only the best choices
        bestChoices = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Ascending,
            selectionRange
        );
        // get only the worst choices
        worstChoices = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Descending,
            selectionRange
        );

        // convert base winrate to per-hero
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
