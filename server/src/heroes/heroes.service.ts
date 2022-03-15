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

    async getBestHeroesForMap(mapName : string, minSampleSize : number = 30) : Promise<Array<Hero>>
    {
        let bestHeroes = [];

        console.log("Got map : ", mapName);
        console.log("Got min sample size: ", minSampleSize);

        const browser = await puppeteer.launch({ headless: false });
        const page = await browser.newPage();
        await page.goto(`https://www.hotslogs.com/Sitewide/HeroAndMapStatistics?Map=${mapName}`);

        await browser.close();

        return (bestHeroes);
    }
}
