import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthRoute } from "@/routes/auth.route";
import { setupTestApp } from "../setup-e2e";

describe("Rate Limiting (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthRoute],
		}).compile();

		app = moduleFixture.createNestApplication();
		await setupTestApp(app);
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	describe("Authentication Rate Limiting", () => {
		it("deve permitir tentativas dentro do limite (login)", async () => {
			const loginData = {
				email: "test@example.com",
				password: "wrongpassword",
			};

			// Primeira tentativa deve passar (mesmo com credenciais erradas)
			await request(app.getHttpServer())
				.post("/auth/login")
				.send(loginData)
				.expect(401); // Credenciais inválidas, mas não rate limited

			// Segunda tentativa deve passar
			await request(app.getHttpServer())
				.post("/auth/login")
				.send(loginData)
				.expect(401);
		});

		it("deve bloquear após exceder o limite (login)", async () => {
			const loginData = {
				email: "test@example.com",
				password: "wrongpassword",
			};

			// Fazer 5 tentativas (limite configurado)
			for (let i = 0; i < 5; i++) {
				await request(app.getHttpServer())
					.post("/auth/login")
					.send(loginData);
			}

			// 6ª tentativa deve ser bloqueada
			await request(app.getHttpServer())
				.post("/auth/login")
				.send(loginData)
				.expect(429); // Too Many Requests
		});

		it("deve permitir tentativas dentro do limite (register)", async () => {
			const registerData = {
				name: "Test User",
				email: "newuser@example.com",
				password: "password123",
				type: "PATIENT",
			};

			// Primeira tentativa
			await request(app.getHttpServer())
				.post("/auth/register")
				.send(registerData)
				.expect(201);

			// Segunda tentativa com email diferente
			const registerData2 = {
				...registerData,
				email: "newuser2@example.com",
			};

			await request(app.getHttpServer())
				.post("/auth/register")
				.send(registerData2)
				.expect(201);
		});

		it("deve bloquear após exceder o limite (register)", async () => {
			// Fazer 3 tentativas (limite configurado para register)
			for (let i = 0; i < 3; i++) {
				const registerData = {
					name: "Test User",
					email: `user${i}@example.com`,
					password: "password123",
					type: "PATIENT",
				};

				await request(app.getHttpServer())
					.post("/auth/register")
					.send(registerData);
			}

			// 4ª tentativa deve ser bloqueada
			const registerData = {
				name: "Test User",
				email: "blocked@example.com",
				password: "password123",
				type: "PATIENT",
			};

			await request(app.getHttpServer())
				.post("/auth/register")
				.send(registerData)
				.expect(429); // Too Many Requests
		});
	});

	describe("Rate Limiting Headers", () => {
		it("deve incluir headers de rate limiting nas respostas", async () => {
			const loginData = {
				email: "test@example.com",
				password: "wrongpassword",
			};

			const response = await request(app.getHttpServer())
				.post("/auth/login")
				.send(loginData);

			// Verificar se headers de rate limiting estão presentes
			expect(response.headers).toHaveProperty('x-ratelimit-limit');
			expect(response.headers).toHaveProperty('x-ratelimit-remaining');
		});
	});
});
