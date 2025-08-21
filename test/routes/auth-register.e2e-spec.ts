import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthRegisterModule } from "@/modules/auth/register.module";
import { setupTestApp } from "../setup-e2e";

describe("AuthRegisterRoute (e2e)", () => {
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
		it("deve registrar um novo usuário com dados válidos", () => {
			const userData = {
				name: "Novo Usuário",
				email: "novo@example.com",
				password: "SenhaForte123",
				type: "PATIENT",
			};

			return request(app.getHttpServer())
				.post("/auth/register")
				.send(userData)
				.expect(201)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("id");
					expect(res.body.data).toHaveProperty("name", userData.name);
					expect(res.body.data).toHaveProperty("email", userData.email);
					expect(res.body.data).toHaveProperty("type", userData.type);
					expect(res.body.data).not.toHaveProperty("password");
				});
		});

		it("deve rejeitar email duplicado", async () => {
			const userData = {
				name: "Usuário Test",
				email: "duplicado@example.com",
				password: "SenhaForte123",
				type: "PATIENT",
			};

			// Criar primeiro usuário
			await request(app.getHttpServer())
				.post("/auth/register")
				.send(userData)
				.expect(201);

			// Tentar criar usuário com o mesmo email
			return request(app.getHttpServer())
				.post("/auth/register")
				.send(userData)
				.expect(409)
				.expect((res) => {
					expect(res.body.message).toContain("Email já está em uso");
				});
		});

		it("deve rejeitar dados inválidos", () => {
			const invalidData = {
				name: "",
				email: "email-invalido",
				password: "123", // muito fraca
				type: "INVALID_TYPE",
			};

			return request(app.getHttpServer())
				.post("/auth/register")
				.send(invalidData)
				.expect(400);
		});

		it("deve rejeitar corpo da requisição vazio", () => {
			return request(app.getHttpServer())
				.post("/auth/register")
				.send({})
				.expect(400);
		});
	});
});