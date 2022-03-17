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

        const browser = await puppeteer.launch({ headless: true });
        const page = await browser.newPage();
        // ! the map needs to be properly written and capital letters at the start of words
        await page.goto(
            `https://www.hotslogs.com/Sitewide/HeroAndMapStatistics?Map=${mapName}`
        );

        let tableToScrape = await page.$("#DataTables_Table_0");

        console.log(tableToScrape === null ? "Table not found" : "FOund table");

        allHeroStats = await this.heroScraping.scrapeGenericTable(
            tableToScrape,
            5,
            minSampleSize
        );

        console.log("Closing browser");
        await browser.close();

        console.log("Filtering heroes");

        let bestHeroes = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Ascending,
            selectionRange
        );
        let worstHeroes = this.heroScraping.filterHeroesWinrate(
            allHeroStats,
            Sorting.Descending,
            selectionRange
        );

        console.log("Concatting arrays");
        heroChoices = heroChoices.concat(bestHeroes, worstHeroes);

        for (let i = 0; i < heroChoices.length; i++) {
            const hero = heroChoices[i];
            hero.winRatePerMap[mapName] = hero.winRate;
        }

        console.log("returning", heroChoices);
        return heroChoices;
    }
}
