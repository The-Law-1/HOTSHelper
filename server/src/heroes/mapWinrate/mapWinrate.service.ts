import { Injectable } from "@nestjs/common";
import { Hero } from "../dto/hero.dto";
import {
    HeroScrapingHelper,
    Sorting,
} from "../scraping/heroScrapingHelper.service";
const puppeteer = require("puppeteer");

@Injectable()
export class MapWinrateService {
    constructor(private readonly heroScraping: HeroScrapingHelper) {}

    async getHeroChoicesForMap(
        mapName: string,
        minSampleSize: number = 30,
        selectionRange: number = 8
    ): Promise<Array<Hero>> {
        let allHeroStats = [];
        let heroChoices = [];

        console.log("Got map : ", mapName);
        console.log("Got min sample size: ", minSampleSize);
        console.log("Starting browser at ", new Date());

        const browser = await this.heroScraping.GetBrowser();

        const page = await browser.newPage();
        // ! the map needs to be properly written and capital letters at the start of words

        // todo use promise.race to either load the page first or find the element and move on
        // * the context gets destroyed when the page loads lol
        let urlString = `https://www.hotslogs.com/Sitewide/HeroAndMapStatistics?Map=${mapName}`;
        try {
            await page.goto(urlString);
        } catch (error) {
            console.log("Error navigating to page ", error);
            await browser.close();
            // * return an error
            return ([]);
        }

        let tableToScrape = await page.waitForSelector("#DataTables_Table_0");
        console.log("Scraped table at ", new Date());

        console.log(tableToScrape === null ? "Table not found" : "FOund table");

        allHeroStats = await this.heroScraping.scrapeGenericTable(
            tableToScrape,
            5,
            minSampleSize
        );

        console.log("Scraped heroes and closing at ", new Date());

        await browser.close();

        let worstHeroes = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Descending,
            selectionRange
        );
        let bestHeroes = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Ascending,
            selectionRange
        );

        heroChoices = heroChoices.concat(bestHeroes, worstHeroes);

        for (let i = 0; i < heroChoices.length; i++) {
            const hero = heroChoices[i];
            hero.winRatePerMap[mapName] = hero.winRate;
        }
        console.log("Returning at ", new Date());

        return heroChoices;
    }
}
