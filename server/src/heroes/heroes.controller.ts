import { Controller, Get, Param, Query, Req } from "@nestjs/common";
import { ApiQuery } from "@nestjs/swagger";
import { Hero } from "./hero.dto";
import { HeroesService } from "./heroes.service";

@Controller("heroes")
export class HeroesController {
    constructor(private readonly heroesService: HeroesService) {}

    // * it doesn't seem to matter if you write the endpoint with or without the parameters
    // * prbably bc of query
    // * keeping it for clarity though
    @Get("/map/:name/:minSampleSize?")
    // * need to do this so swagger still shows the param
    @ApiQuery({
        name: "minSampleSize",
        type: Number,
        description: "Minimum sample size, optional",
        required: false
    })
    async getBestHeroesForMap(@Query("name") name: string,
                              @Query("minSampleSize") minSampleSize ? : number
                              ): Promise<Array<Hero>> {

        let bestHeroes = await this.heroesService.getBestHeroesForMap(name, minSampleSize);

        return (bestHeroes);
    }
}
