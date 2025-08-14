import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import * as request from "supertest";
import type { App } from "supertest/types";
import { AppModule } from "@/app.module";

describe("AppController (e2e)", () => {
	let app: INestApplication<App>;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('should GET "/hello-world" and returns "Hello World"', () => {
		return request(app.getHttpServer())
			.get("/hello-world")
			.expect(200)
			.expect("Hello World!");
	});
});
