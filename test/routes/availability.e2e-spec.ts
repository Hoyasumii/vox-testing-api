import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AvailabilityRoute } from "@/routes/availability.route";
import { createTestUser, createTestAvailability, setupTestApp } from "../setup-e2e";

describe("AvailabilityRoute (e2e)", () => {
	let app: INestApplication;
	let doctorId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [AvailabilityRoute],
		}).compile();

		app = moduleFixture.createNestApplication();
		await setupTestApp(app);

		// Criar médico de teste
		const doctor = await createTestUser("DOCTOR");
		doctorId = doctor.id;

		// Criar algumas disponibilidades
		await createTestAvailability(doctorId);
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	describe("GET /availability/slots", () => {
		it("deve buscar slots disponíveis por médico", () => {
			const today = new Date();
			const queryParams = {
				doctorId,
				date: today.toISOString().split('T')[0], // YYYY-MM-DD
			};

			return request(app.getHttpServer())
				.get("/availability/slots")
				.query(queryParams)
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body.data)).toBe(true);
				});
		});

		it("deve buscar slots em um período", () => {
			const startDate = new Date();
			const endDate = new Date();
			endDate.setDate(endDate.getDate() + 7);

			const queryParams = {
				doctorId,
				startDate: startDate.toISOString().split('T')[0],
				endDate: endDate.toISOString().split('T')[0],
			};

			return request(app.getHttpServer())
				.get("/availability/slots")
				.query(queryParams)
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body.data)).toBe(true);
				});
		});

		it("deve retornar erro quando doctorId não for fornecido", () => {
			return request(app.getHttpServer())
				.get("/availability/slots")
				.expect(400);
		});

		it("deve retornar lista vazia para médico sem disponibilidades", () => {
			return request(app.getHttpServer())
				.get("/availability/slots")
				.query({ doctorId: "medico-sem-disponibilidades" })
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body.data)).toBe(true);
					expect(res.body.data.length).toBe(0);
				});
		});

		it("deve rejeitar data inválida", () => {
			const queryParams = {
				doctorId,
				date: "data-invalida",
			};

			return request(app.getHttpServer())
				.get("/availability/slots")
				.query(queryParams)
				.expect(400);
		});

		it("deve funcionar sem parâmetros de data (usar data atual)", () => {
			return request(app.getHttpServer())
				.get("/availability/slots")
				.query({ doctorId })
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body.data)).toBe(true);
				});
		});
	});
});
