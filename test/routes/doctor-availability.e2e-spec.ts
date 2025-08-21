import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { DoctorAvailabilityRoute } from "@/routes/doctor-availability.route";
import { createTestUser, createTestAvailability, setupTestApp } from "../setup-e2e";
import { SignJwtToken } from "@/services/jwt";

describe("DoctorAvailabilityRoute (e2e)", () => {
	let app: INestApplication;
	let doctorToken: string;
	let patientToken: string;
	let doctorId: string;
	let patientId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [DoctorAvailabilityRoute],
		}).compile();

		app = moduleFixture.createNestApplication();
		await setupTestApp(app);

		// Criar médico e paciente de teste
		const doctor = await createTestUser("DOCTOR");
		const patient = await createTestUser("PATIENT");
		doctorId = doctor.id;
		patientId = patient.id;

		const signJwtToken = new SignJwtToken();
		doctorToken = await signJwtToken.run({ userId: doctor.id });
		patientToken = await signJwtToken.run({ userId: patient.id });
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	describe("POST /doctors/:doctorId/availability", () => {
		it("deve criar disponibilidade como médico", () => {
			const availabilityData = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			return request(app.getHttpServer())
				.post(`/doctors/${doctorId}/availability`)
				.set("Authorization", `Bearer ${doctorToken}`)
				.send(availabilityData)
				.expect(201)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("id");
					expect(res.body.data).toHaveProperty("doctorId", doctorId);
					expect(res.body.data).toHaveProperty("dayOfWeek", 1);
					expect(res.body.data).toHaveProperty("startHour", 9);
					expect(res.body.data).toHaveProperty("endHour", 17);
				});
		});

		it("deve rejeitar criação por paciente", () => {
			const availabilityData = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			return request(app.getHttpServer())
				.post(`/doctors/${doctorId}/availability`)
				.set("Authorization", `Bearer ${patientToken}`)
				.send(availabilityData)
				.expect(403);
		});

		it("deve rejeitar criação para outro médico", () => {
			const availabilityData = {
				doctorId: "outro-medico-id",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			return request(app.getHttpServer())
				.post(`/doctors/outro-medico-id/availability`)
				.set("Authorization", `Bearer ${doctorToken}`)
				.send(availabilityData)
				.expect(403);
		});

		it("deve rejeitar dados inválidos", () => {
			const invalidData = {
				dayOfWeek: 8, // Inválido
				startHour: 25, // Inválido
				endHour: 5, // Menor que startHour
			};

			return request(app.getHttpServer())
				.post(`/doctors/${doctorId}/availability`)
				.set("Authorization", `Bearer ${doctorToken}`)
				.send(invalidData)
				.expect(400);
		});

		it("deve rejeitar request sem token", () => {
			const availabilityData = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			return request(app.getHttpServer())
				.post(`/doctors/${doctorId}/availability`)
				.send(availabilityData)
				.expect(401);
		});
	});

	describe("GET /doctors/:doctorId/availability", () => {
		it("deve listar disponibilidades do médico", async () => {
			// Criar algumas disponibilidades primeiro
			await createTestAvailability(doctorId);

			return request(app.getHttpServer())
				.get(`/doctors/${doctorId}/availability`)
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body.data)).toBe(true);
					expect(res.body.data.length).toBeGreaterThan(0);
					expect(res.body[0]).toHaveProperty("id");
					expect(res.body[0]).toHaveProperty("doctorId", doctorId);
				});
		});

		it("deve retornar lista vazia para médico sem disponibilidades", () => {
			return request(app.getHttpServer())
				.get(`/doctors/${doctorId}/availability`)
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body.data)).toBe(true);
					expect(res.body.data.length).toBe(0);
				});
		});
	});

	describe("PUT /doctors/:doctorId/availability/:id", () => {
		let availabilityId: string;

		beforeEach(async () => {
			const availability = await createTestAvailability(doctorId);
			availabilityId = availability.id;
		});

		it("deve atualizar disponibilidade", () => {
			const updateData = {
				startHour: 8,
				endHour: 16,
			};

			return request(app.getHttpServer())
				.put(`/doctors/${doctorId}/availability/${availabilityId}`)
				.set("Authorization", `Bearer ${doctorToken}`)
				.send(updateData)
				.expect(200)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("startHour", 8);
					expect(res.body.data).toHaveProperty("endHour", 16);
				});
		});

		it("deve rejeitar dados inválidos", () => {
			const invalidData = {
				startHour: 25,
			};

			return request(app.getHttpServer())
				.put(`/doctors/${doctorId}/availability/${availabilityId}`)
				.set("Authorization", `Bearer ${doctorToken}`)
				.send(invalidData)
				.expect(400);
		});
	});

	describe("DELETE /doctors/:doctorId/availability/:id", () => {
		let availabilityId: string;

		beforeEach(async () => {
			const availability = await createTestAvailability(doctorId);
			availabilityId = availability.id;
		});

		it("deve deletar disponibilidade específica", () => {
			return request(app.getHttpServer())
				.delete(`/doctors/${doctorId}/availability/${availabilityId}`)
				.expect(200);
		});

		it("deve retornar 404 para disponibilidade inexistente", () => {
			return request(app.getHttpServer())
				.delete(`/doctors/${doctorId}/availability/inexistente`)
				.expect(404);
		});
	});

	describe("DELETE /doctors/:doctorId/availability", () => {
		beforeEach(async () => {
			// Criar algumas disponibilidades
			await createTestAvailability(doctorId);
			await createTestAvailability(doctorId);
		});

		it("deve deletar todas disponibilidades do médico", () => {
			return request(app.getHttpServer())
				.delete(`/doctors/${doctorId}/availability`)
				.expect(200)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("deletedCount");
					expect(res.body.data.deletedCount).toBeGreaterThan(0);
				});
		});
	});
});
