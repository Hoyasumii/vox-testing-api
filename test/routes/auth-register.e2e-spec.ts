import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthRegisterModule } from "@/modules/auth/register.module";

describe("AuthRegisterModule (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthRegisterModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	describe("POST /", () => {
		it("deve criar um usuário com dados válidos", () => {
			const userData = {
				name: "João Silva",
				email: `test-${Date.now()}@email.com`,
				password: "Password123!",
				type: "PATIENT",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(userData)
				.expect(201)
				.expect((res) => {
					expect(res.body).toMatch(
						/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
					);
				});
		});

		it("deve criar um usuário médico com dados válidos", () => {
			const userData = {
				name: "Dr. Maria Santos",
				email: `doctor-${Date.now()}@email.com`,
				password: "Password123!",
				type: "DOCTOR",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(userData)
				.expect(201)
				.expect((res) => {
					expect(res.body).toMatch(
						/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
					);
				});
		});

		it("deve rejeitar usuário com email inválido", () => {
			const userData = {
				name: "João Silva",
				email: "email-invalido",
				password: "Password123!",
				type: "PATIENT",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(userData)
				.expect(400);
		});

		it("deve rejeitar usuário com senha fraca", () => {
			const userData = {
				name: "João Silva",
				email: `weak-password-${Date.now()}@email.com`,
				password: "123",
				type: "PATIENT",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(userData)
				.expect(400);
		});

		it("deve rejeitar usuário sem nome", () => {
			const userData = {
				email: `no-name-${Date.now()}@email.com`,
				password: "Password123!",
				type: "PATIENT",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(userData)
				.expect(400);
		});

		it("deve rejeitar dados vazios", () => {
			return request(app.getHttpServer())
				.post("/")
				.send({})
				.expect(400);
		});

		it("deve criar usuário sem tipo especificado (usando default)", () => {
			const userData = {
				name: "Ana Costa",
				email: `no-type-${Date.now()}@email.com`,
				password: "Password123!",
			};

			return request(app.getHttpServer())
				.post("/")
				.send(userData)
				.expect(201)
				.expect((res) => {
					expect(res.body).toMatch(
						/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/
					);
				});
		});
	});
});
