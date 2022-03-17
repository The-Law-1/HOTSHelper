import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { ApiBody, ApiQuery } from "@nestjs/swagger";
import { Hero } from "./hero.dto";
import { HeroesService } from "./heroes.service";

@Controller("heroes")
export class HeroesController {
    constructor(private readonly heroesService: HeroesService) {}

    // * it doesn't seem to matter if you write the endpoint with or without the parameters
    // * prbably bc of query
    // * keeping it for clarity though
    @Get("/map/:name/:minSampleSize?/:selectionRange?")
    // * need to do this so swagger still shows the param
    @ApiQuery({
        name: "minSampleSize",
        type: Number,
        description: "Minimum sample size, optional",
        required: false,
    })
    @ApiQuery({
        name: "selectionRange",
        type: Number,
        description: "Hero selection range, optional",
        required: false,
    })
    async getBestHeroesForMap(
        @Query("name") name: string,
        @Query("minSampleSize") minSampleSize?: number,
        @Query("selectionRange") selectionRange?: number
    ): Promise<Array<Hero>> {
        let heroChoices = await this.heroesService.getHeroChoicesForMap(
            name,
            minSampleSize,
            selectionRange
        );

        return heroChoices;
    }

    @Post("/team/synergies/:minSampleSize?/:selectionRange?")
    // * need to do this so swagger still shows the param
    @ApiQuery({
        name: "minSampleSize",
        type: Number,
        description: "Minimum sample size, optional",
        required: false,
    })
    @ApiQuery({
        name: "selectionRange",
        type: Number,
        description: "Hero selection range, optional",
        required: false,
    })
    @ApiBody({
        type: [Hero],
        description: "Allied heroes array",
    })
    async getTeamSynergies(
        @Body() allyTeam: [Hero],
        @Query("minSampleSize") minSampleSize?: number,
        @Query("selectionRange") selectionRange?: number
    ): Promise<Array<Hero>> {
        // ! you really only need an array of names for the ally team
        let heroChoices = await this.heroesService.getSynergyWinrates(
            allyTeam,
            minSampleSize,
            selectionRange
        );

        return heroChoices;
    }
}
