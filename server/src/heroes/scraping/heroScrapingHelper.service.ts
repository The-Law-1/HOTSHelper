import { Injectable } from '@nestjs/common';
import { ElementHandle } from 'puppeteer';
import { Hero } from '../hero.dto';

export enum Sorting {
    Ascending,
    Descending,
}

@Injectable()
export class HeroScrapingHelper {
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

                // ? hero portrait url ?
            }
            currentID++;
        }

        return heroStats;
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
