import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthRefreshTokenModule } from "@/modules/auth/refresh-token.module";
import * as jwt from "jsonwebtoken";

describe("AuthRefreshTokenModule (e2e)", () => {
	let app: INestApplication;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AuthRefreshTokenModule],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	afterEach(async () => {
		await app.close();
	});

	it("deve rejeitar requisição sem Authorization header", () => {
		return request(app.getHttpServer())
			.post("/")
			.expect(400)
			.expect((res) => {
				expect(res.body.message).toBe("Token de autorização é obrigatório");
			});
	});

	it("deve rejeitar token com formato inválido", () => {
		return request(app.getHttpServer())
			.post("/")
			.set("Authorization", "InvalidFormat token123")
			.expect(400)
			.expect((res) => {
				expect(res.body.message).toBe("Formato de token inválido. Use: Bearer <token>");
			});
	});

	it("deve rejeitar token inválido", () => {
		return request(app.getHttpServer())
			.post("/")
			.set("Authorization", "Bearer invalid.jwt.token")
			.expect(401)
			.expect((res) => {
				expect(res.body.message).toBe("Token inválido ou expirado");
			});
	});

	it("deve renovar um token válido", () => {
		// Gerar um token válido para teste
		const validToken = jwt.sign(
			{ userId: "123" },
			process.env.JWT_PRIVATE_KEY,
			{ expiresIn: "1h" }
		);

		return request(app.getHttpServer())
			.post("/")
			.set("Authorization", `Bearer ${validToken}`)
			.expect(201)
			.expect((res) => {
				expect(res.body).toHaveProperty("token");
				expect(typeof res.body.token).toBe("string");
				expect(res.body.token).not.toBe(validToken); // Deve ser um novo token
			});
	});
});
