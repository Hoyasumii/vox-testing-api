import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { SchedulesRoute } from "@/routes/schedules.route";
import { createTestUser, createTestAvailability, createTestSchedule, setupTestApp } from "../setup-e2e";
import { SignJwtToken } from "@/services/jwt";

describe("SchedulesRoute (e2e)", () => {
	let app: INestApplication;
	let doctorToken: string;
	let patientToken: string;
	let doctorId: string;
	let patientId: string;
	let availabilityId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [SchedulesRoute],
		}).compile();

		app = moduleFixture.createNestApplication();
		await setupTestApp(app);

		// Criar médico e paciente de teste
		const doctor = await createTestUser("DOCTOR");
		const patient = await createTestUser("PATIENT");
		doctorId = doctor.id;
		patientId = patient.id;

		// Criar disponibilidade
		const availability = await createTestAvailability(doctorId);
		availabilityId = availability.id;

		const signJwtToken = new SignJwtToken();
		doctorToken = await signJwtToken.run({ userId: doctor.id });
		patientToken = await signJwtToken.run({ userId: patient.id });
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	describe("POST /schedules", () => {
		it("deve criar agendamento com dados válidos", () => {
			const scheduledAt = new Date();
			scheduledAt.setDate(scheduledAt.getDate() + 1);
			scheduledAt.setHours(10, 0, 0, 0);

			const scheduleData = {
				doctorId,
				availabilityId,
				scheduledAt: scheduledAt.toISOString(),
			};

			return request(app.getHttpServer())
				.post("/schedules")
				.set("Authorization", `Bearer ${patientToken}`)
				.send(scheduleData)
				.expect(201)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("id");
					expect(res.body.data).toHaveProperty("patientId", patientId);
					expect(res.body.data).toHaveProperty("doctorId", doctorId);
					expect(res.body.data).toHaveProperty("availabilityId", availabilityId);
					expect(res.body.data).toHaveProperty("status", "SCHEDULED");
				});
		});

		it("deve rejeitar request sem token", () => {
			const scheduledAt = new Date();
			scheduledAt.setDate(scheduledAt.getDate() + 1);
			scheduledAt.setHours(10, 0, 0, 0);

			const scheduleData = {
				doctorId,
				availabilityId,
				scheduledAt: scheduledAt.toISOString(),
			};

			return request(app.getHttpServer())
				.post("/schedules")
				.send(scheduleData)
				.expect(401);
		});
	});

	describe("GET /schedules/me", () => {
		it("deve listar agendamentos do paciente", async () => {
			const schedule = await createTestSchedule(patientId, doctorId, availabilityId);

			return request(app.getHttpServer())
				.get("/schedules/me")
				.set("Authorization", `Bearer ${patientToken}`)
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body.data)).toBe(true);
					expect(res.body.data.length).toBeGreaterThan(0);
				});
		});

		it("deve rejeitar request sem token", () => {
			return request(app.getHttpServer())
				.get("/schedules/me")
				.expect(401);
		});
	});

	describe("GET /schedules/:id", () => {
		it("deve retornar agendamento específico", async () => {
			const schedule = await createTestSchedule(patientId, doctorId, availabilityId);
			const scheduleId = schedule.id;

			return request(app.getHttpServer())
				.get(`/schedules/${scheduleId}`)
				.set("Authorization", `Bearer ${patientToken}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("id", scheduleId);
					expect(res.body.data).toHaveProperty("patientId", patientId);
				});
		});
	});

	describe("PUT /schedules/:id/cancel", () => {
		it("deve cancelar agendamento como paciente", async () => {
			const schedule = await createTestSchedule(patientId, doctorId, availabilityId);
			const scheduleId = schedule.id;

			return request(app.getHttpServer())
				.put(`/schedules/${scheduleId}/cancel`)
				.set("Authorization", `Bearer ${patientToken}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.data).toBe(true);
				});
		});
	});

	describe("DELETE /schedules/:id", () => {
		it("deve deletar agendamento", async () => {
			const schedule = await createTestSchedule(patientId, doctorId, availabilityId);
			const scheduleId = schedule.id;

			return request(app.getHttpServer())
				.delete(`/schedules/${scheduleId}`)
				.set("Authorization", `Bearer ${patientToken}`)
				.expect(200);
		});
	});
});