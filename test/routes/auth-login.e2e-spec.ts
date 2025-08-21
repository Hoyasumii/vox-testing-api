import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthLoginModule } from "@/modules/auth/login.module";
import { createTestUser, setupTestApp } from "../setup-e2e";

describe("AuthLoginModule (e2e)", () => {
	let app: INestApplication;
	let testUserEmail: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthLoginModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await setupTestApp(app);

		// Criar usuário de teste
		testUserEmail = `test-${Date.now()}@email.com`;
		await createTestUser("PATIENT", testUserEmail);
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	describe("POST /", () => {
		it("deve autenticar usuário com credenciais válidas", async () => {
			const credentials = {
				email: testUserEmail,
				password: "Password123!", // senha padrão do createTestUser
			};

			const response = await request(app.getHttpServer())
				.post("/")
				.send(credentials);

			expect(response.status).toBe(201);
			// A resposta deve conter o JWT no formato padronizado
			expect(response.body).toHaveProperty("success", true);
			expect(response.body).toHaveProperty("data");
			expect(typeof response.body.data).toBe("string");
			expect(response.body.data.split(".")).toHaveLength(3); // JWT tem 3 partes separadas por ponto
		});

		it("deve rejeitar credenciais com email inválido", () => {
			const credentials = {
				email: "email-invalido",
				password: "Password123!",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(credentials)
				.expect(400);
		});

		it("deve rejeitar credenciais com senha fraca", () => {
			const credentials = {
				email: testUserEmail,
				password: "123", // senha que não atende aos critérios
			};

			return request(app.getHttpServer())
				.post("/")
				.send(credentials)
				.expect(400);
		});

		it("deve rejeitar credenciais sem email", () => {
			const credentials = {
				password: "Password123!",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(credentials)
				.expect(400);
		});

		it("deve rejeitar credenciais sem senha", () => {
			const credentials = {
				email: testUserEmail,
			};

			return request(app.getHttpServer())
				.post("/")
				.send(credentials)
				.expect(400);
		});

		it("deve rejeitar dados vazios", () => {
			return request(app.getHttpServer())
				.post("/")
				.send({})
				.expect(400);
		});

		it("deve rejeitar email inexistente", () => {
			const credentials = {
				email: "inexistente@email.com",
				password: "Password123!",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(credentials)
				.expect(400);
		});

		it("deve rejeitar senha incorreta", () => {
			const credentials = {
				email: testUserEmail,
				password: "SenhaErrada123!",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(credentials)
				.expect(400);
		});
	});
});
