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

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const urlString = `https://www.hotslogs.com/Default`;
        await page.goto(urlString);

        let tableToScrape = await page.$("#DataTables_Table_0");

        let rowChildrenArray = await this.heroScraping.tableTo2DArray(
            tableToScrape
        );

        console.log("Got row children ", rowChildrenArray.length);

        // * loop over all the rows
        for (let i = 0; i < rowChildrenArray.length; i++) {
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

            heroesInfo.push(heroInfo);
        }
        console.log("Got heroes basic info");

        return heroesInfo;
    }
}
