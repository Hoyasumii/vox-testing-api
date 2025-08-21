import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { ReportsRoute } from "@/routes/reports.route";
import { createTestUser, createTestAvailability, createTestSchedule, setupTestApp } from "../setup-e2e";
import { SignJwtToken } from "@/services/jwt";

describe("ReportsRoute (e2e)", () => {
	let app: INestApplication;
	let doctorToken: string;
	let patientToken: string;
	let doctorId: string;
	let patientId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [ReportsRoute],
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

		// Criar alguns agendamentos de teste
		const availability = await createTestAvailability(doctorId);
		await createTestSchedule(patientId, doctorId, availability.id);
	});

	afterEach(async () => {
		if (app) {
			await app.close();
		}
	});

	describe("GET /doctors/:doctorId/schedules", () => {
		it("deve listar agendamentos do médico", () => {
			return request(app.getHttpServer())
				.get(`/doctors/${doctorId}/schedules`)
				.set("Authorization", `Bearer ${doctorToken}`)
				.expect(200)
				.expect((res) => {
					expect(Array.isArray(res.body.data)).toBe(true);
					expect(res.body.data.length).toBeGreaterThan(0);
					expect(res.body[0]).toHaveProperty("doctorId", doctorId);
				});
		});

		it("deve permitir acesso do próprio médico", () => {
			return request(app.getHttpServer())
				.get(`/doctors/${doctorId}/schedules`)
				.set("Authorization", `Bearer ${doctorToken}`)
				.expect(200);
		});

		it("deve rejeitar acesso de outro usuário", () => {
			return request(app.getHttpServer())
				.get(`/doctors/${doctorId}/schedules`)
				.set("Authorization", `Bearer ${patientToken}`)
				.expect(403);
		});

		it("deve rejeitar request sem token", () => {
			return request(app.getHttpServer())
				.get(`/doctors/${doctorId}/schedules`)
				.expect(401);
		});

		it("deve retornar lista vazia para médico sem agendamentos", () => {
			// Criar outro médico sem agendamentos
			return createTestUser("DOCTOR").then(async (newDoctor) => {
				const newDoctorToken = await new SignJwtToken().run({ userId: newDoctor.id });

				return request(app.getHttpServer())
					.get(`/doctors/${newDoctor.id}/schedules`)
					.set("Authorization", `Bearer ${newDoctorToken}`)
					.expect(200)
					.expect((res) => {
						expect(Array.isArray(res.body.data)).toBe(true);
						expect(res.body.data.length).toBe(0);
					});
			});
		});

		it("deve retornar 404 para médico inexistente", () => {
			return request(app.getHttpServer())
				.get("/doctors/medico-inexistente/schedules")
				.set("Authorization", `Bearer ${doctorToken}`)
				.expect(404);
		});
	});
});
