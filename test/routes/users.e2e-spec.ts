import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AuthLoginModule } from "@/modules/auth/login.module";
import { GetUserDataModule } from "@/modules/users/get-user-data.module";
import { UpdateUserModule } from "@/modules/users/update-user.module";
import { DeleteUserModule } from "@/modules/users/delete-user.module";
import { createTestUser, setupTestApp } from "../setup-e2e";

describe("Users Route (e2e)", () => {
	let app: INestApplication;
	let accessToken: string;
	let testUserEmail: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AuthLoginModule,
				GetUserDataModule,
				UpdateUserModule,
				DeleteUserModule,
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await setupTestApp(app);
		await app.init();

		// Criar usuário de teste e fazer login
		testUserEmail = `test-${Date.now()}@email.com`;
		await createTestUser("PATIENT", testUserEmail);

		// Fazer login
		const loginResponse = await request(app.getHttpServer())
			.post("/")
			.send({
				email: testUserEmail,
				password: "Password123!", // senha padrão do createTestUser
			});
		
		if (loginResponse.body?.success && loginResponse.body?.data) {
			accessToken = loginResponse.body.data; // O token está diretamente em data
			
			// Debug: vamos testar se conseguimos verificar o token manualmente
			try {
				const { VerifyJwtToken } = require('@/services/jwt');
				const verifyService = new VerifyJwtToken();
				const payload = await verifyService.run(accessToken);
				console.log("JWT verification successful:", payload);
				
				// Debug: vamos testar se conseguimos buscar o usuário diretamente
				const { makeGetUserContentByIdFactory } = require('@/factories/users');
				const userService = makeGetUserContentByIdFactory();
				const user = await userService.run(payload.userId);
				console.log("User fetch successful:", user?.id);
			} catch (error) {
				console.log("Manual verification failed:", error.message);
			}
			
		} else {
			throw new Error(`Failed to get access token. Response: ${JSON.stringify(loginResponse.body)}`);
		}
	});

	afterEach(async () => {
		await app.close();
	});

	describe("GET /users/me", () => {
		it("should get user profile data with valid token", async () => {
			const response = await request(app.getHttpServer())
				.get("/")
				.set("Authorization", `Bearer ${accessToken}`);

			console.log("GET / response:", {
				status: response.status,
				body: response.body
			});

			expect(response.status).toBe(200);

			expect(response.body).toEqual(
				expect.objectContaining({
					data: expect.objectContaining({
						id: expect.any(String),
						email: testUserEmail,
						name: expect.any(String),
						userType: "PATIENT",
						createdAt: expect.any(String),
					}),
					success: true,
				}),
			);
		});

		it("should return 401 without authorization header", async () => {
			const response = await request(app.getHttpServer())
				.get("/users/me")
				.expect(401);

			expect(response.body).toEqual(
				expect.objectContaining({
					success: false,
				}),
			);
		});

		it("should return 401 with invalid token", async () => {
			const response = await request(app.getHttpServer())
				.get("/users/me")
				.set("Authorization", "Bearer invalid_token")
				.expect(401);

			expect(response.body).toEqual(
				expect.objectContaining({
					success: false,
				}),
			);
		});

		it("should return 401 with malformed authorization header", async () => {
			const response = await request(app.getHttpServer())
				.get("/users/me")
				.set("Authorization", "InvalidFormat token")
				.expect(401);

			expect(response.body).toEqual(
				expect.objectContaining({
					success: false,
				}),
			);
		});
	});

	describe("PUT /users/me", () => {
		it("should update user profile with valid data", async () => {
			const updateData = {
				name: "Updated Name",
				email: testUserEmail,
			};

			const response = await request(app.getHttpServer())
				.put("/users/me")
				.set("Authorization", `Bearer ${accessToken}`)
				.send(updateData)
				.expect(200);

			expect(response.body).toEqual(
				expect.objectContaining({
					data: expect.objectContaining({
						id: expect.any(String),
						email: testUserEmail,
						name: "Updated Name",
						userType: "PATIENT",
						updatedAt: expect.any(String),
					}),
					success: true,
				}),
			);
		});

		it("should return 400 with invalid email format", async () => {
			const updateData = {
				name: "Jane Smith",
				email: "invalid-email",
			};

			const response = await request(app.getHttpServer())
				.put("/users/me")
				.set("Authorization", `Bearer ${accessToken}`)
				.send(updateData)
				.expect(400);

			expect(response.body).toEqual(
				expect.objectContaining({
					success: false,
				}),
			);
		});

		it("should return 400 with empty name", async () => {
			const updateData = {
				name: "",
				email: "jane.smith@example.com",
			};

			const response = await request(app.getHttpServer())
				.put("/users/me")
				.set("Authorization", `Bearer ${accessToken}`)
				.send(updateData)
				.expect(400);

			expect(response.body).toEqual(
				expect.objectContaining({
					success: false,
				}),
			);
		});

		it("should return 401 without authorization header", async () => {
			const updateData = {
				name: "Jane Smith",
				email: "jane.smith@example.com",
			};

			const response = await request(app.getHttpServer())
				.put("/users/me")
				.send(updateData)
				.expect(401);

			expect(response.body).toEqual(
				expect.objectContaining({
					success: false,
				}),
			);
		});
	});

	describe("DELETE /users/me", () => {
		it("should delete user account with valid token", async () => {
			const response = await request(app.getHttpServer())
				.delete("/users/me")
				.set("Authorization", `Bearer ${accessToken}`)
				.expect(200);

			expect(response.body).toEqual(
				expect.objectContaining({
					data: expect.objectContaining({
						message: expect.any(String),
					}),
					success: true,
				}),
			);
		});

		it("should return 401 without authorization header", async () => {
			const response = await request(app.getHttpServer())
				.delete("/users/me")
				.expect(401);

			expect(response.body).toEqual(
				expect.objectContaining({
					success: false,
				}),
			);
		});

		it("should return 401 with invalid token", async () => {
			const response = await request(app.getHttpServer())
				.delete("/users/me")
				.set("Authorization", "Bearer invalid_token")
				.expect(401);

			expect(response.body).toEqual(
				expect.objectContaining({
					success: false,
				}),
			);
		});
	});
});
