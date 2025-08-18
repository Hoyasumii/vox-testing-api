import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthLoginModule } from "@/modules/auth/login.module";

describe("AuthLoginModule (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthLoginModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	describe("POST /", () => {
		it("deve autenticar usuário com credenciais válidas", () => {
			const credentials = {
				email: "test@email.com",
				password: "Password123!",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(credentials)
				.expect(201)
				.expect((res) => {
					// Verifica se retorna um JWT válido
					expect(typeof res.body).toBe("string");
					expect(res.body.split(".")).toHaveLength(3); // JWT tem 3 partes separadas por ponto
				});
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
				email: "test@email.com",
				password: "123",
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
				email: "test@email.com",
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
				email: "test@email.com",
				password: "SenhaErrada123!",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(credentials)
				.expect(400);
		});
	});
});
