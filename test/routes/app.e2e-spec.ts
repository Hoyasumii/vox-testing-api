import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "@/app.module";
import { setupTestApp } from "../setup-e2e";

describe("AppController (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AppModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await setupTestApp(app);
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	it('should GET "/hello-world" and returns "Hello World"', () => {
		return request(app.getHttpServer())
			.get("/hello-world")
			.expect(200)
			.expect((res) => {
				// A resposta deve estar no formato padronizado
				expect(res.body).toHaveProperty("success", true);
				expect(res.body).toHaveProperty("data");
				expect(res.body.data).toHaveProperty("message", "Hello World!");
			});
	});
});
