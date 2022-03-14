import { Module } from "@nestjs/common";
import { AppController } from "./app.controller";
import { AppService } from "./app.service";
import { CatsController } from "./cats/cats.controller";
import { CatsService } from "./cats/cats.service";
import { HeroesController } from "./heroes/heroes.controller";
import { HeroesService } from "./heroes/heroes.service";

@Module({
    imports: [],
    controllers: [AppController, CatsController, HeroesController],
    providers: [AppService, CatsService, HeroesService],
})
export class AppModule {}
