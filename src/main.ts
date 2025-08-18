import { HttpAdapterHost } from "@nestjs/core";
import { AppModule } from "./app.module";
import { CatchEverything, StandardizeResponse } from "./interceptors";
import { AppBuilder } from "./app-builder";

async function bootstrap() {
	const app = await AppBuilder.build(AppModule);
	const port = process.env.PORT ?? 3000;

	app.enableCors();

	app.useGlobalInterceptors(new StandardizeResponse());

	const httpAdapterHost = app.get(HttpAdapterHost);
	app.useGlobalFilters(new CatchEverything(httpAdapterHost));

	await app.listen(port);
}

bootstrap();
