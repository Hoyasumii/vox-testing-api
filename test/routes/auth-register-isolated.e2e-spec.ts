import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthRegisterModule } from "@/modules/auth/register.module";
import { setupTestApp } from "../setup-e2e";

describe("AuthRegisterIsolated (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthRegisterModule],
		}).compile();

		app = await setupTestApp(moduleFixture.createNestApplication());
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	describe("POST /auth/register", () => {
		it("deve registrar um novo usuário com dados válidos", async () => {
			const userData = {
				name: "Novo Usuário",
				email: `novo-${Date.now()}@example.com`,
				password: "SenhaForte123",
				type: "PATIENT",
			};

			const response = await request(app.getHttpServer())
				.post("/auth/register")
				.send(userData);
			
			console.log("Response status:", response.status);
			console.log("Response body:", JSON.stringify(response.body, null, 2));
			
			expect(response.status).toBe(201);
			expect(response.body.data).toHaveProperty("id");
			expect(response.body.data).toHaveProperty("name", userData.name);
			expect(response.body.data).toHaveProperty("email", userData.email);
			expect(response.body.data).toHaveProperty("type", userData.type);
			expect(response.body.data).not.toHaveProperty("password");
		});
	});
});
