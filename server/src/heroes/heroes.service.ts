const puppeteer = require('puppeteer');
import { Injectable } from "@nestjs/common";
import { Hero } from "./hero.dto";

@Injectable()
export class HeroesService {
    async test(): Promise<any> {
        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto("https://www.hotslogs.com/Default");

        let firstRowElement = await page.$("#__0");

        let firstRowChildren = await firstRowElement.$$("td");

        firstRowChildren.forEach(async (child) => {
            // * el here is an element, which is a type and has properties
            // * https://developer.mozilla.org/en-US/docs/Web/API/Element
            let htmlValue = await child.evaluate((el) => el.textContent);
            console.log(htmlValue);
        });

        // other actions...
        await browser.close();
    }

    async getHeroChoicesForMap(mapName : string, minSampleSize : number = 30) : Promise<Array<Hero>>
    {
        let allHeroStats = [];
        let bestHeroes = [];

        let maxHeroChoice = 8; // * get the eight best/worst choices

        console.log("Got map : ", mapName);
        console.log("Got min sample size: ", minSampleSize);

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        // ! the map needs to be properly written and capital letters at the start of words
        await page.goto(`https://www.hotslogs.com/Sitewide/HeroAndMapStatistics?Map=${mapName}`);

        // ! check if the page is not valid

        let currentID = 0;
        let stopSearching = false;

        // * loop over all the rows
        while (!stopSearching) {
            let rowElement = await page.$(`#__${currentID}`);

            if (rowElement === null) {
                stopSearching = true;
                break;
            }


            currentID++;
        }
        // * if sample size is >=
        // * scrape all the hero data we can get (name, winrate (RELATIVE TO MAP), sample)

        // * operate on the heroStats, like parse the 8 best & worse

        await browser.close();

        return (bestHeroes);
    }
}
