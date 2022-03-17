// * have the builtin validator validate it :https://docs.nestjs.com/techniques/validation

export class TeamsDto {
    allies: Array<string> = [null, null, null, null, null];
    enemies: Array<string> = [null, null, null, null, null];
}
