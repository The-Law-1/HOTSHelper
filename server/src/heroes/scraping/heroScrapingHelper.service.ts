import { Injectable, OnApplicationShutdown } from "@nestjs/common";
import { table } from "console";
import { Browser, ElementHandle } from "puppeteer";
import { sample } from "rxjs";
import { Hero } from "../dto/hero.dto";
const puppeteer = require("puppeteer");

export enum Sorting {
    Ascending,
    Descending,
}

export enum GameMode {
    STORMLEAGUE = 0,
    QUICKMATCH = 3
}

@Injectable()
export class HeroScrapingHelper implements OnApplicationShutdown {
    static browserEndpoint: string = "";

    // * cf https://docs.nestjs.com/fundamentals/lifecycle-events
    async onApplicationShutdown(signal?: string) {
        console.log("Retrieved signal ", signal);

        if (HeroScrapingHelper.browserEndpoint !== "") {
            console.log("Closing browser");
            let browser = await puppeteer.launch({ headless: false });
            await browser.close();
            console.log("Closed browser");
        }
    }

    async GetBrowser(headless: boolean = true): Promise<Browser> {
        let browser = null;
        browser = await puppeteer.launch({
            headless: headless,
            userDataDir: "puppeteerCache",
            args: ["--no-sandbox"],
        });

        return browser;

        // * the browser's performance is okay, it's the page loading that takes time
        // if (HeroScrapingHelper.browserEndpoint === "") { // * create a new browser
        //     console.log("Creating a new browser");
        //     browser = await puppeteer.launch({ headless: false});
        //     HeroScrapingHelper.browserEndpoint = browser.wsEndpoint();
        //     console.log("New endpoint: ", HeroScrapingHelper.browserEndpoint);
        // } else {
        //     console.log("Browser endpoint: ", HeroScrapingHelper.browserEndpoint);
        //     console.log("Connecting to browser");
        //     browser = await puppeteer.connect({
        //         browserWSEndpoint: HeroScrapingHelper.browserEndpoint,
        //         headless: false
        //     });
        // }

        // return (browser);
    }

    // scrapes name, sample size, winrate from a generic table on hotslogs
    // the name and sample size is often the same index, but not the winrate index, you need to pass it
    // just count the columns
    async scrapeGenericTable(
        tableToScrape: ElementHandle<Element>,
        winrateIndex: number,
        minSampleSize: number = 30
    ): Promise<Array<Hero>> {
        let heroStats = [];

        // * retrieve all the rows at once
        let rowChildrenArray = await this.tableTo2DArray(tableToScrape);

        // * loop over all the rows
        for (let i = 0; i < rowChildrenArray.length; i++) {
            const rowChildren = rowChildrenArray[i];

            // * get sample size
            let sampleSize = await rowChildren[2].evaluate((el: Element) =>
                el.textContent.replace(",", "")
            );

            if (parseInt(sampleSize) >= minSampleSize) {

                const { heroName, winRate } = await this.parseRow(rowChildren, {
                    heroName: 1,
                    winRate: winrateIndex,
                });

                // * replace spaces, dots, apostrophes
                let portraitUrlName = heroName.replace(/[. \'-]/g, "");
                let portraitUrl = `https://hotslogs.com/Images/Heroes/Portraits/${portraitUrlName}.png`;

                // todo get more info maybe, like portrait or smth, better too much than not enough
                let scrapedHero = new Hero(
                    heroName,
                    parseInt(sampleSize),
                    parseFloat(winRate),
                    {},
                    {},
                    {},
                    portraitUrl
                );
                heroStats.push(scrapedHero);
            }
        }
        return heroStats;
    }

    async tableTo2DArray(
        tableToScrape: ElementHandle<Element>
    ): Promise<Array<Array<ElementHandle<Element>>>> {
        // * retrieve all the rows at once, careful, the table header contains trs so only get from tbody
        let tableRows = await tableToScrape.$$("tbody tr");
        let rowChildrenArray = [];

        // * i don't think there's a better way to do this, there's two scrapes either way
        // * https://stackoverflow.com/questions/49236981/want-to-scrape-table-using-puppeteer-how-can-i-get-all-rows-iterate-through-ro
        for (let i = 0; i < tableRows.length; i++) {
            let tableRow = tableRows[i];

            let rowChildren = await tableRow.$$("td");

            rowChildrenArray.push(rowChildren);
        }
        return rowChildrenArray;
    }

    async parseRow(
        rowChildren: Array<ElementHandle>,
        indexesToParse: { [key: string]: number }
    ): Promise<any> {
        let results = {};

        for (const [key, index] of Object.entries(indexesToParse)) {
            results[key] = await rowChildren[index].evaluate(
                (el: Element) => el.textContent
            );
        }

        return results;
    }

    filterHeroesWinrate(
        heroSamples: Array<Hero>,
        sort: Sorting,
        maxSelection: number
    ): Array<Hero> {
        let result = [];
        let currentComp = 0;
        let currentHero = null;

        //  we are butchering this array
        let heroSamplesCopy = [...heroSamples];

        // the idea here is to get the best/worst maxselection
        for (let i = 0; i < maxSelection; i++) {
            currentComp = sort === Sorting.Ascending ? 0 : 100;

            heroSamplesCopy.forEach((hero) => {
                if (
                    (hero.winRate > currentComp &&
                        sort === Sorting.Ascending) ||
                    (hero.winRate < currentComp && sort === Sorting.Descending)
                ) {
                    currentComp = hero.winRate;
                    currentHero = hero;
                }
            });
            if (currentHero !== null) {
                // * remove it from the samples and push it to the results
                heroSamplesCopy = heroSamplesCopy.filter(
                    (hero) => hero.name !== currentHero.name
                );
                result.push(currentHero);
                currentHero = null;
            }
        }

        return result;
    }
}
