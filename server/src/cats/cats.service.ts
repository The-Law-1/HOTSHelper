import { Injectable } from "@nestjs/common";
import { Cat } from "./cat.dto";

@Injectable()
export class CatsService {
    SayHiToCat(cat: Cat): string {
        return `Hello ${cat.name}`;
    }
}
