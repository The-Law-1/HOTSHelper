import { NestFactory } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from "./app.module";

const port = process.env.SERVER_PORT || 3001;

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    app.enableCors();

    const config = new DocumentBuilder()
        .setTitle("HotsHelper")
        .setDescription("HotsHelper API description")
        .setVersion("1.0")
        .addTag("HOTS")
        .build();
    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup("api", app, document);

    // * this could have been good if the single browser trick worked
    // * but since it doesn't it's just bad for performance I think
    // app.enableShutdownHooks();

    await app.listen(port);
}
bootstrap();
