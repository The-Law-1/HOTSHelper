const puppeteer = require("puppeteer");
import { Injectable } from "@nestjs/common";
import { Browser, ElementHandle, Page } from "puppeteer";
import { Hero } from "./hero.dto";

enum Sorting {
    Ascending,
    Descending,
}

@Injectable()
export class HeroesService {
    async test(): Promise<any> {
        const browser = await puppeteer.launch({ headless: true });
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
                        minSampleSize
                    );
                console.log("Got choices");
                console.log(bestChoices);
                console.log(worstChoices);

                // * for each allied hero, push synergies to best/worst choices array
                bestChoicesArray.push(bestChoices);
                worstChoicesArray.push(worstChoices);
            }
        }

        // * get x best/worst elements for each ally
        let samplesPerHero = 2;
        // ! you're supposed to have {selectionRange} items in here so we should be fine with this
        // ! but be careful
        // todo also don't suggest a hero if it's already in the team !!
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
        minSampleSize: number = 30
    ): Promise<any> {
        let allHeroStats = [];
        let bestChoices = [];
        let worstChoices = [];

        const page = await browser.newPage();
        // ! hero name needs to be properly written and capital letters at the start of words
        console.log("Hero duos for : " + heroName);

        const urlString = `https://www.hotslogs.com/Sitewide/TalentDetails?Hero=${heroName}&Tab=winRateWithOtherHeroes`;

        await page.goto(urlString);

        console.log("page loaded");

        // await page.waitForSelector("#DataTables_Table_1", {timeout: 10000});

        // * make sure you get the correct table id and send it to the function
        let tableToScrape = await page.$("#DataTables_Table_1");

        console.log(tableToScrape === null ? "Table not found" : "FOund table");

        allHeroStats = await this.scrapeGenericTable(
            tableToScrape,
            3,
            minSampleSize
        );

        bestChoices = this.filterHeroesWinrate(
            allHeroStats,
            Sorting.Ascending,
            selectionRange
        );
        worstChoices = this.filterHeroesWinrate(
            allHeroStats,
            Sorting.Descending,
            selectionRange
        );

        console.log(bestChoices);
        console.log(worstChoices);

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

    // * scrapes name, sample size, winrate from a generic table on hotslogs
    // * the name and sample size is often the same index, but not the winrate index, you need to pass it
    // * just count the columns
    async scrapeGenericTable(
        tableToScrape: ElementHandle<Element>,
        winrateIndex: number,
        minSampleSize: number = 30
    ): Promise<Array<Hero>> {
        let heroStats = [];

        let currentID = 0;
        let stopSearching = false;

        // todo export some of these to their separate functions

        // todo we really should get the amount of heroes from somewhere and make this a for loop
        // * loop over all the rows
        while (!stopSearching) {
            let rowElement = await tableToScrape.$(`#__${currentID}`);
            console.log("Found row");

            if (rowElement === null) {
                stopSearching = true;
                console.log("Broke out of the search loop at id ", currentID);
                break;
            }
            let rowChildren = await rowElement.$$("td");

            if (rowChildren === null) {
                console.log("Failed to find row children");
                // todo throw an error which you will catch !!
            }

            console.log("Found row children");

            // * get sample size
            let sampleSize = await rowChildren[2].evaluate(
                (el: Element) => el.textContent
            );

            if (parseInt(sampleSize) >= minSampleSize) {
                // * scrape all the hero data we can get (name, winrate (RELATIVE TO MAP), sample)

                // * get hero name
                let heroName = await rowChildren[1].evaluate(
                    (el: Element) => el.textContent
                );

                // * win %
                let winRate = await rowChildren[winrateIndex].evaluate(
                    (el: Element) => el.textContent
                );

                let scrapedHero = new Hero(
                    heroName,
                    parseInt(sampleSize),
                    parseFloat(winRate)
                );

                heroStats.push(scrapedHero);
                console.log("Scraped hero ", scrapedHero);

                // ? hero portrait url ?
            }
            currentID++;
        }

        return heroStats;
    }

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

        // ! check if the page is not valid

        let currentID = 0;
        let stopSearching = false;

        // todo export some of these to their separate functions

        // todo we really should get the amount of heroes from somewhere and make this a for loop
        // * loop over all the rows
        while (!stopSearching) {
            let rowElement = await page.$(`#__${currentID}`);

            if (rowElement === null) {
                stopSearching = true;
                console.log("Broke out of the search loop at id ", currentID);
                break;
            }
            let rowChildren = await rowElement.$$("td");

            // * get sample size
            let sampleSize = await rowChildren[2].evaluate(
                (el: Element) => el.textContent
            );

            if (parseInt(sampleSize) >= minSampleSize) {
                // * scrape all the hero data we can get (name, winrate (RELATIVE TO MAP), sample)

                // * get hero name
                let heroName = await rowChildren[1].evaluate(
                    (el: Element) => el.textContent
                );

                // * win %
                let winRate = await rowChildren[5].evaluate(
                    (el: Element) => el.textContent
                );

                allHeroStats.push(
                    new Hero(
                        heroName,
                        parseInt(sampleSize),
                        parseFloat(winRate),
                        { [mapName]: winRate }
                    )
                );

                // ? hero portrait url ?
            }
            currentID++;
        }

        console.log("Closing browser");
        await browser.close();

        console.log("Filtering heroes");

        let bestHeroes = this.filterHeroesWinrate(
            allHeroStats,
            Sorting.Ascending,
            selectionRange
        );
        let worstHeroes = this.filterHeroesWinrate(
            allHeroStats,
            Sorting.Descending,
            selectionRange
        );

        console.log("Concatting arrays");
        heroChoices = heroChoices.concat(bestHeroes, worstHeroes);

        console.log("returning", heroChoices);
        return heroChoices;
    }

    filterHeroesWinrate(
        heroSamples: Array<Hero>,
        sort: Sorting,
        maxSelection: number
    ): Array<Hero> {
        let result = [];
        let currentComp = 0;
        let currentHero = null;

        for (let i = 0; i < maxSelection; i++) {
            currentComp = sort === Sorting.Ascending ? 0 : 100;

            // ! pretty inefficient but if you got ideas I'm listening
            heroSamples.forEach((hero) => {
                if (
                    result.findIndex(
                        (resHero: Hero) => resHero.name === hero.name
                    ) !== -1
                )
                    return;

                // ! gotta be a better way to do this
                if (sort === Sorting.Ascending) {
                    if (hero.winRate > currentComp) {
                        currentComp = hero.winRate;
                        currentHero = hero;
                    }
                } else {
                    if (hero.winRate < currentComp) {
                        currentComp = hero.winRate;
                        currentHero = hero;
                    }
                }
            });
            if (currentHero !== null) {
                result.push(currentHero);
                currentHero = null;
            }
        }

        return result;
    }
}
