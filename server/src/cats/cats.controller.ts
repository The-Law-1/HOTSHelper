import {
    Body,
    Controller,
    Get,
    HttpCode,
    Param,
    Post,
    Req,
    Request,
} from "@nestjs/common";
import { Cat } from "./cat.dto";
import { CatsService } from "./cats.service";

@Controller("cats")
export class CatsController {
    constructor(private readonly catsService: CatsService) {}

    @Get()
    // @HttpCode(200)
    findAll(@Req() request: Request): string {
        return "Returns all cats";
    }

    @Get(":id")
    findOne(@Param() params: any): string {
        console.log(params.id);

        return `This action returns a cat with id ${params.id}`;
    }

    @Get("hi/:name/:age")
    sayHiToCat(@Param("name") name: string, @Param("age") age: number): string {
        const result = this.catsService.SayHiToCat(new Cat(name, age));

        return result;
    }

    @Post()
    async create(@Body() catEntity: Cat) {
        return {
            message: "Cat created",
            cat: catEntity,
        };
    }
}
