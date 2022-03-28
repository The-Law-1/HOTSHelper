import {
    Body,
    Controller,
    Get,
    Param,
    Post,
    Query,
    Req,
    Response,
} from "@nestjs/common";
import {
    ApiBody,
    ApiQuery,
    ApiResponse,
    ApiResponseProperty,
} from "@nestjs/swagger";
import { Hero } from "./dto/hero.dto";
import { TeamsDto } from "./dto/teams.dto";
import { DuoWinrateService } from "./duoWinrate/duoWinrate.service";
import { MapWinrateService } from "./mapWinrate/mapWinrate.service";
import { MatchupWinrateService } from "./matchupWinrate/matchupWinrate.service";
import { BasicInfoService } from "./scraping/basicInfo.service";

@Controller("heroes")
export class HeroesController {
    constructor(
        private readonly duoWinrateservice: DuoWinrateService,
        private readonly mapWinrateService: MapWinrateService,
        private readonly matchupWinrateService: MatchupWinrateService,
        private readonly basicInfoService: BasicInfoService
    ) {}

    // * the query parameters aren't visible in the URL somehow, and if I put URL params I'm having a hard time making them optional
    // * maybe you could send the info in a specific DTO as a POST request
    @Get("/mapwinrates")
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

    // * cf map request
    @Post("/team/synergies")
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
        console.log("In controller got body: ", heroTeams);

        console.log("controller getting sample size ", minSampleSize);

        // ! you really only need an array of names for the ally team
        let heroChoices = await this.duoWinrateservice.getSynergyWinrates(
            heroTeams.allies,
            heroTeams.enemies === undefined ? [] : heroTeams.enemies,
            minSampleSize,
            selectionRange
        );

        return heroChoices;
    }

    @Post("/team/matchups")
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
        let heroChoices = await this.matchupWinrateService.getMatchupWinrates(
            heroTeams.allies,
            heroTeams.enemies,
            minSampleSize,
            selectionRange
        );

        return heroChoices;
    }

    // * get all the heroes for dropdowns (names + portraits + role + winrate + games played, all but specifics really)
    @Get("/")
    async getAllHeroesBasicInfo(): Promise<Array<Hero>> {
        let heroes = this.basicInfoService.scrapeHeroesBasic();

        return heroes;
    }
}
