import { Injectable } from '@nestjs/common';
import { ElementHandle } from "puppeteer";
import { Hero } from "../dto/hero.dto";
const puppeteer = require("puppeteer");

@Injectable()
export class BasicInfoService {

    async scrapeHeroesBasic(): Promise<Array<Hero>> {
        let heroesInfo = [];

        let currentID = 0;
        let stopSearching = false;

        const browser = await puppeteer.launch();
        const page = await browser.newPage();
        const urlString = `https://www.hotslogs.com/Default`;
        await page.goto(urlString);

        let tableToScrape = await page.$("#DataTables_Table_0");

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

            // * get hero name
            let heroName = await rowChildren[1].evaluate(
                (el: Element) => el.textContent
            );

            // * replace spaces, dots, apostrophes
            let portraitUrlName = heroName.replace(/[. \']/g, "");
            let portraitUrl = `https://hotslogs.com/Images/Heroes/Portraits/${portraitUrlName}.png`;

            let gamesPlayed = await rowChildren[2].evaluate(
                (el : Element) => parseInt(el.textContent.replace(',', ''))
            );
            let winRate = await rowChildren[5].evaluate(
                (el : Element) => parseFloat(el.textContent)
            );
            let role = await rowChildren[7].evaluate(
                (el : Element) => el.textContent
            );

            let heroInfo = new Hero(heroName, gamesPlayed, winRate, {}, {}, {}, portraitUrl, role);

            heroesInfo.push(heroInfo);

            currentID++;
        }

        return heroesInfo;
    }
}
