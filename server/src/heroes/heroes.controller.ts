import { Body, Controller, Get, Param, Post, Query, Req } from "@nestjs/common";
import { ApiBody, ApiQuery } from "@nestjs/swagger";
import { Hero } from "./dto/hero.dto";
import { TeamsDto } from "./dto/teams.dto";
import { DuoWinrateService } from "./duoWinrate/duoWinrate.service";
import { MapWinrateService } from "./mapWinrate/mapWinrate.service";
import { MatchupWinrateService } from "./matchupWinrate/matchupWinrate.service";

@Controller("heroes")
export class HeroesController {
    constructor(
        private readonly duoWinrateservice: DuoWinrateService,
        private readonly mapWinrateService: MapWinrateService,
        private readonly matchupWinrateService: MatchupWinrateService,
    ) {}

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
        let heroChoices = await this.mapWinrateService.getHeroChoicesForMap(
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
        type: TeamsDto,
        description: "Array containing allied, and enemy hero names",
    })
    async getTeamSynergies(
        @Body() heroTeams: TeamsDto,
        @Query("minSampleSize") minSampleSize?: number,
        @Query("selectionRange") selectionRange?: number
    ): Promise<Array<Hero>> {
        // ! you really only need an array of names for the ally team
        let heroChoices = await this.duoWinrateservice.getSynergyWinrates(
            heroTeams.allies,
            heroTeams.enemies,
            minSampleSize,
            selectionRange
        );

        return heroChoices;
    }

    @Post("/team/matchups/:minSampleSize?/:selectionRange?")
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
        type: TeamsDto,
        description: "Array containing allied, and enemy hero names",
    })
    async getTeamMatchups(
        @Body() heroTeams: TeamsDto,
        @Query("minSampleSize") minSampleSize?: number,
        @Query("selectionRange") selectionRange?: number
    ): Promise<Array<Hero>> {
        // ! you really only need an array of names for the ally team

        let heroChoices = await this.matchupWinrateService.getMatchupWinrates(
            heroTeams.allies,
            heroTeams.enemies,
            minSampleSize,
            selectionRange
        );

        return heroChoices;
    }
}
