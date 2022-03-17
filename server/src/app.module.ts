import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsController } from "./cats/cats.controller";
import { CatsService } from "./cats/cats.service";
import { HeroesController } from "./heroes/heroes.controller";
import { DuoWinrateService } from "./heroes/duoWinrate/duoWinrate.service";
import { HeroScrapingHelper } from "./heroes/scraping/heroScrapingHelper.service";
import { MapWinrateService } from "./heroes/mapWinrate/mapWinrate.service";
import { MatchupWinrateService } from "./heroes/matchupWinrate/matchupWinrate.service";

@Module({
    imports: [],
    controllers: [AppController, CatsController, HeroesController],
    providers: [
        AppService,
        CatsService,
        DuoWinrateService,
        HeroScrapingHelper,
        MapWinrateService,
        MatchupWinrateService,
    ],
})
export class AppModule {}
