import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { RouterModule } from "@nestjs/core";
import { AuthLoginModule } from "@/modules/auth/login.module";
import { AuthRegisterModule } from "@/modules/auth/register.module";
import { GetUserDataModule } from "@/modules/users/get-user-data.module";
import { UpdateUserModule } from "@/modules/users/update-user.module";
import { DeleteUserModule } from "@/modules/users/delete-user.module";
import { setupTestApp } from "../setup-e2e";

describe("UsersRoute (e2e)", () => {
	let app: INestApplication;
	let userToken: string;

	beforeAll(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				RouterModule.register([
					{
						path: "users",
						children: [
							{ path: "me", module: GetUserDataModule },
							{ path: "me", module: UpdateUserModule },
							{ path: "me", module: DeleteUserModule },
						],
					},
				]),
				AuthLoginModule,
				AuthRegisterModule,
				GetUserDataModule,
				UpdateUserModule,
				DeleteUserModule,
			],
		}).compile();

		app = await setupTestApp(moduleFixture.createNestApplication());

		// Criar e fazer login de um usuário de teste
		await request(app.getHttpServer())
			.post("/auth/register")
			.send({
				name: "Usuário Teste Users",
				email: "users-test@example.com",
				password: "SenhaForte123",
				type: "PATIENT",
			})
			.expect(201);

		const loginResponse = await request(app.getHttpServer())
			.post("/auth/login")
			.send({
				email: "users-test@example.com",
				password: "SenhaForte123",
			})
			.expect(200);

		userToken = loginResponse.body.data.token;
	});

	afterAll(async () => {
		if (app) {
			await app.close();
		}
	});

	describe("GET /users/me", () => {
		it("deve retornar dados do usuário logado", () => {
			return request(app.getHttpServer())
				.get("/users/me")
				.set("Authorization", `Bearer ${userToken}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data).toHaveProperty("id");
					expect(res.body.data).toHaveProperty("name", "Usuário Teste Users");
					expect(res.body.data).toHaveProperty("email", "users-test@example.com");
					expect(res.body.data).not.toHaveProperty("password");
				});
		});

		it("deve rejeitar request sem token", () => {
			return request(app.getHttpServer())
				.get("/users/me")
				.expect(401);
		});

		it("deve rejeitar token inválido", () => {
			return request(app.getHttpServer())
				.get("/users/me")
				.set("Authorization", "Bearer token-invalido")
				.expect(401);
		});
	});

	describe("PUT /users/me", () => {
		it("deve atualizar dados do usuário logado", () => {
			const updateData = {
				name: "Usuário Atualizado",
			};

			return request(app.getHttpServer())
				.put("/users/me")
				.set("Authorization", `Bearer ${userToken}`)
				.send(updateData)
				.expect(200)
				.expect((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data).toHaveProperty("name", updateData.name);
				});
		});

		it("deve permitir atualização parcial", () => {
			const updateData = {
				name: "Novo Nome Parcial",
			};

			return request(app.getHttpServer())
				.put("/users/me")
				.set("Authorization", `Bearer ${userToken}`)
				.send(updateData)
				.expect(200)
				.expect((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data).toHaveProperty("name", updateData.name);
					expect(res.body.data).toHaveProperty("email", "users-test@example.com");
				});
		});

		it("deve rejeitar dados inválidos", () => {
			const invalidData = {
				email: "email-invalido",
			};

			return request(app.getHttpServer())
				.put("/users/me")
				.set("Authorization", `Bearer ${userToken}`)
				.send(invalidData)
				.expect(400);
		});

		it("deve rejeitar request sem token", () => {
			return request(app.getHttpServer())
				.put("/users/me")
				.send({ name: "Teste" })
				.expect(401);
		});

		it("deve atualizar senha corretamente", () => {
			const updateData = {
				password: "NovaSenhaForte456",
			};

			return request(app.getHttpServer())
				.put("/users/me")
				.set("Authorization", `Bearer ${userToken}`)
				.send(updateData)
				.expect(200)
				.expect((res) => {
					expect(res.body.success).toBe(true);
					expect(res.body.data).not.toHaveProperty("password");
				});
		});
	});

	describe("DELETE /users/me", () => {
		it("deve deletar conta do usuário logado", () => {
			return request(app.getHttpServer())
				.delete("/users/me")
				.set("Authorization", `Bearer ${userToken}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.success).toBe(true);
				});
		});

		it("deve rejeitar request sem token", () => {
			return request(app.getHttpServer())
				.delete("/users/me")
				.expect(401);
		});

		it("deve invalidar token após deletar conta", async () => {
			// Primeiro criar um novo usuário para testar a invalidação
			await request(app.getHttpServer())
				.post("/auth/register")
				.send({
					name: "Usuário Para Deletar",
					email: "delete-test@example.com",
					password: "SenhaForte123",
					type: "PATIENT",
				})
				.expect(201);

			const loginResponse = await request(app.getHttpServer())
				.post("/auth/login")
				.send({
					email: "delete-test@example.com",
					password: "SenhaForte123",
				})
				.expect(200);

			const tempToken = loginResponse.body.data.token;

			// Deletar a conta
			await request(app.getHttpServer())
				.delete("/users/me")
				.set("Authorization", `Bearer ${tempToken}`)
				.expect(200);

			// Tentar usar o token deletado
			return request(app.getHttpServer())
				.get("/users/me")
				.set("Authorization", `Bearer ${tempToken}`)
				.expect(401);
		});
	});
});
