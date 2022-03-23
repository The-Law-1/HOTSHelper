import { Injectable } from "@nestjs/common";
import { ElementHandle } from "puppeteer";
import { Hero } from "../dto/hero.dto";
import { HeroScrapingHelper } from "./heroScrapingHelper.service";
const puppeteer = require("puppeteer");

@Injectable()
export class BasicInfoService {
    constructor(private readonly heroScraping: HeroScrapingHelper) {}

    async scrapeHeroesBasic(): Promise<Array<Hero>> {
        let heroesInfo = [];

        console.log("Starting browser at ", new Date());
        let browser = await this.heroScraping.GetBrowser();

        const page = await browser.newPage();
        const urlString = `https://www.hotslogs.com/Default`;
        await page.goto(urlString);

        console.log("Went to page", urlString);
        const pageMetrics = await page.metrics();
        console.log("Got page metrics, duration :", pageMetrics.TaskDuration);

        let tableToScrape = await page.$("#DataTables_Table_0");
        console.log("Scraped first table");

        let rowChildrenArray = await this.heroScraping.tableTo2DArray(
            tableToScrape
        );

        // * we should close this page huh ? Or stop opening new ones
        //await page.close();
        console.log("Scraped table at ", new Date());

        // console.log("Got row children ", rowChildrenArray.length);

        // * loop over all the rows
        for (let i = 0; i < rowChildrenArray.length; i++) {
            if (i === 0) {
                console.log("In loop to parse rows");
            }
            const rowChildren = rowChildrenArray[i];

            const { heroName, winRate, role, gamesPlayed } =
                await this.heroScraping.parseRow(rowChildren, {
                    heroName: 1,
                    winRate: 5,
                    role: 7,
                    gamesPlayed: 2,
                });
            

            // * replace spaces, dots, apostrophes
            let portraitUrlName = heroName.replace(/[. \']/g, "");
            let portraitUrl = `https://hotslogs.com/Images/Heroes/Portraits/${portraitUrlName}.png`;

            let heroInfo = new Hero(
                heroName,
                parseInt(gamesPlayed.replace(",", "")),
                parseFloat(winRate),
                {},
                {},
                {},
                portraitUrl,
                role
            );

            if (i === 0) {
                console.log("Finished one loop");
            }
            heroesInfo.push(heroInfo);
        }
        console.log("Got heroes basic info");

        await browser.close();
        return heroesInfo;
    }
}
