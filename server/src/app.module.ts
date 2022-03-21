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
import { ConfigModule } from "@nestjs/config";
import { BasicInfoService } from './heroes/scraping/basicInfo.service';

// * config module = env vars cf : https://docs.nestjs.com/techniques/configuration

@Module({
    imports: [ConfigModule.forRoot({
        isGlobal : true,
    })],
    controllers: [AppController, CatsController, HeroesController],
    providers: [
        AppService,
        CatsService,
        DuoWinrateService,
        HeroScrapingHelper,
        MapWinrateService,
        MatchupWinrateService,
        BasicInfoService,
    ],
})
export class AppModule {}
