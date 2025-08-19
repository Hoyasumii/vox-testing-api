import { HttpAdapterHost } from "@nestjs/core";
import { SwaggerModule, DocumentBuilder } from "@nestjs/swagger";
import { AppModule } from "./app.module";
import { CatchEverything, StandardizeResponse } from "./interceptors";
import { AppBuilder } from "./app-builder";
import { apiReference } from "@scalar/nestjs-api-reference";

async function bootstrap() {
	const app = await AppBuilder.build(AppModule);
	const port = process.env.PORT ?? 3000;

	app.enableCors();

	app.useGlobalInterceptors(new StandardizeResponse());

	const httpAdapterHost = app.get(HttpAdapterHost);
	app.useGlobalFilters(new CatchEverything(httpAdapterHost));

	const openApiConfig = new DocumentBuilder()
		.setTitle("Vox Testing - Alan Reis")
		.setVersion("1.0")
		.build();

	const content = SwaggerModule.createDocument(app, openApiConfig);

	app.use("/docs", apiReference({ content, theme: "kepler" }))

	// SwaggerModule.setup("docs", app, documentFactory);

	await app.listen(port);
}

bootstrap();
