const puppeteer = require("puppeteer");
import { Injectable } from "@nestjs/common";
import { NOTFOUND } from "dns";
import { Hero } from "./hero.dto";

enum Sorting
{
    Ascending,
    Descending
}

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

    async getHeroChoicesForMap(
        mapName: string,
        minSampleSize: number = 30,
        selectionRange: number = 8
    ): Promise<Array<Hero>> {
        let allHeroStats = [];
        let heroChoices = [];

        console.log("Got map : ", mapName);
        console.log("Got min sample size: ", minSampleSize);

        const browser = await puppeteer.launch({ headless: false });
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
                        { [mapName] : winRate }
                    )
                );

                // ? hero portrait url ?
            }
            currentID++;
        }

        console.log("Closing browser");
        await browser.close();

        console.log("Filtering heroes");

        let bestHeroes = this.filterHeroesWinrate(allHeroStats, Sorting.Ascending, selectionRange);
        let worstHeroes = this.filterHeroesWinrate(allHeroStats, Sorting.Descending, selectionRange);

        console.log("Concatting arrays");
        heroChoices = heroChoices.concat(bestHeroes, worstHeroes);

        console.log("returning", heroChoices);
        return heroChoices;
    }

    filterHeroesWinrate(heroSamples : Array<Hero>, sort : Sorting, maxSelection : number) : Array<Hero>
    {
        let result = [];
        let currentComp = 0;
        let currentHero = null;

        for (let i = 0; i < maxSelection; i++) {
            currentComp = sort === Sorting.Ascending ? 0 : 100;

            // ! pretty inefficient but if you got ideas I'm listening
            heroSamples.forEach(hero => {
                if (result.findIndex((resHero : Hero) => resHero.name === hero.name) !== -1)
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

        return (result);
    }
}
