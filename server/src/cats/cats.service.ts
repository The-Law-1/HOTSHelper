import { Injectable } from "@nestjs/common";
import { Cat } from "./cat";

@Injectable()
export class CatsService {
    SayHiToCat(cat: Cat): string {
        return `Hello ${cat.name}`;
    }
}
