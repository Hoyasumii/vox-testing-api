import { ScheduleRepository } from "./schedule.repository";
import { CreateScheduleDTO } from "@/dtos/schedules";
import { MemoryCache } from "../cache/memory-cache";
import { testChannel } from "t/channels";

describe("ScheduleRepository", () => {
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
	});

	describe("create", () => {
		it("deve criar um agendamento com sucesso", async () => {
			const scheduleData: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const result = await repository.create(scheduleData);

			expect(result).toBeDefined();
			expect(result.id).toBeDefined();
			expect(result.status).toBe("SCHEDULED");
			expect(result.availabilityId).toBe(scheduleData.availabilityId);
			expect(result.patientId).toBe(scheduleData.patientId);
			expect(result.doctorId).toBe(scheduleData.doctorId);
			expect(result.scheduledAt).toEqual(scheduleData.scheduledAt);
			expect(repository.count()).toBe(1);
		});

		it("deve criar múltiplos agendamentos com IDs únicos", async () => {
			const scheduleData1: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: "availability-124",
				patientId: "patient-124",
				doctorId: "doctor-124",
				scheduledAt: new Date("2025-08-20T11:00:00.000Z"),
			};

			const result1 = await repository.create(scheduleData1);
			const result2 = await repository.create(scheduleData2);

			expect(result1.id).not.toBe(result2.id);
			expect(repository.count()).toBe(2);
		});
	});

	describe("findById", () => {
		it("deve encontrar um agendamento por ID", async () => {
			const scheduleData: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const created = await repository.create(scheduleData);
			const found = await repository.findById(created.id);

			expect(found).toBeDefined();
			expect(found?.id).toBe(created.id);
			expect(found?.status).toBe("SCHEDULED");
			expect(found?.availabilityId).toBe(scheduleData.availabilityId);
		});

		it("deve retornar null para ID inexistente", async () => {
			const result = await repository.findById("non-existent-id");
			expect(result).toBeNull();
		});
	});

	describe("findByPatientId", () => {
		it("deve encontrar agendamentos por ID do paciente", async () => {
			const patientId = "patient-123";
			const scheduleData1: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId,
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: "availability-124",
				patientId,
				doctorId: "doctor-124",
				scheduledAt: new Date("2025-08-20T11:00:00.000Z"),
			};

			const scheduleData3: CreateScheduleDTO = {
				availabilityId: "availability-125",
				patientId: "other-patient",
				doctorId: "doctor-125",
				scheduledAt: new Date("2025-08-20T12:00:00.000Z"),
			};

			await repository.create(scheduleData1);
			await repository.create(scheduleData2);
			await repository.create(scheduleData3);

			const result = await repository.findByPatientId(patientId);

			expect(result).toHaveLength(2);
			expect(result.every((s) => s.patientId === patientId)).toBe(true);
		});

		it("deve retornar array vazio para paciente sem agendamentos", async () => {
			const result = await repository.findByPatientId("non-existent-patient");
			expect(result).toEqual([]);
		});
	});

	describe("findByDoctorId", () => {
		it("deve encontrar agendamentos por ID do médico", async () => {
			const doctorId = "doctor-123";
			const scheduleData1: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId,
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: "availability-124",
				patientId: "patient-124",
				doctorId,
				scheduledAt: new Date("2025-08-20T11:00:00.000Z"),
			};

			const scheduleData3: CreateScheduleDTO = {
				availabilityId: "availability-125",
				patientId: "patient-125",
				doctorId: "other-doctor",
				scheduledAt: new Date("2025-08-20T12:00:00.000Z"),
			};

			await repository.create(scheduleData1);
			await repository.create(scheduleData2);
			await repository.create(scheduleData3);

			const result = await repository.findByDoctorId(doctorId);

			expect(result).toHaveLength(2);
			expect(result.every((s) => s.doctorId === doctorId)).toBe(true);
		});

		it("deve retornar array vazio para médico sem agendamentos", async () => {
			const result = await repository.findByDoctorId("non-existent-doctor");
			expect(result).toEqual([]);
		});
	});

	describe("delete", () => {
		it("deve deletar um agendamento existente", async () => {
			const scheduleData: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const created = await repository.create(scheduleData);
			const deleted = await repository.delete(created.id);

			expect(deleted).toBe(true);
			expect(repository.count()).toBe(0);

			const found = await repository.findById(created.id);
			expect(found).toBeNull();
		});

		it("deve retornar false para ID inexistente", async () => {
			const result = await repository.delete("non-existent-id");
			expect(result).toBe(false);
		});
	});

	describe("getAvailableSlots", () => {
		beforeEach(() => {
			// Adiciona algumas disponibilidades para teste
			repository.addAvailability({
				availabilityId: "avail-1",
				doctorId: "doctor-123",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 10,
				availableDate: new Date("2025-08-20T09:00:00.000Z"),
				isAvailable: true,
			});

			repository.addAvailability({
				availabilityId: "avail-2",
				doctorId: "doctor-123",
				dayOfWeek: 1,
				startHour: 10,
				endHour: 11,
				availableDate: new Date("2025-08-20T10:00:00.000Z"),
				isAvailable: false,
			});

			repository.addAvailability({
				availabilityId: "avail-3",
				doctorId: "other-doctor",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 10,
				availableDate: new Date("2025-08-20T09:00:00.000Z"),
				isAvailable: true,
			});
		});

		it("deve retornar apenas slots disponíveis do médico específico", async () => {
			const result = await repository.getAvailableSlots("doctor-123");

			expect(result).toHaveLength(1);
			expect(result[0].doctorId).toBe("doctor-123");
			expect(result[0].isAvailable).toBe(true);
			expect(result[0].availabilityId).toBe("avail-1");
		});

		it("deve retornar array vazio para médico sem disponibilidades", async () => {
			const result = await repository.getAvailableSlots("non-existent-doctor");
			expect(result).toEqual([]);
		});
	});

	describe("isDoctorAvailable", () => {
		beforeEach(() => {
			// Adiciona disponibilidade para teste
			repository.addAvailability({
				availabilityId: "avail-1",
				doctorId: "doctor-123",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 10,
				availableDate: new Date("2025-08-20T09:00:00.000Z"),
				isAvailable: true,
			});
		});

		it("deve retornar true quando médico está disponível", async () => {
			const targetDate = new Date("2025-08-20T09:00:00.000Z");
			const result = await repository.isDoctorAvailable("doctor-123", targetDate);

			expect(result).toBe(true);
		});

		it("deve retornar false quando não há disponibilidade", async () => {
			const targetDate = new Date("2025-08-21T09:00:00.000Z");
			const result = await repository.isDoctorAvailable("doctor-123", targetDate);

			expect(result).toBe(false);
		});

		it("deve retornar false quando há conflito de agendamento", async () => {
			const targetDate = new Date("2025-08-20T09:00:00.000Z");

			// Cria um agendamento que conflita
			await repository.create({
				availabilityId: "avail-1",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: targetDate,
			});

			const result = await repository.isDoctorAvailable("doctor-123", targetDate);

			expect(result).toBe(false);
		});

		it("deve retornar false para médico inexistente", async () => {
			const targetDate = new Date("2025-08-20T09:00:00.000Z");
			const result = await repository.isDoctorAvailable("non-existent-doctor", targetDate);

			expect(result).toBe(false);
		});
	});

	describe("cancel", () => {
		it("deve cancelar um agendamento agendado", async () => {
			const scheduleData: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const created = await repository.create(scheduleData);
			const result = await repository.cancel(created.id);

			expect(result).toBe(true);

			const updated = await repository.findById(created.id);
			expect(updated?.status).toBe("CANCELED");
		});

		it("deve retornar false para agendamento inexistente", async () => {
			const result = await repository.cancel("non-existent-id");
			expect(result).toBe(false);
		});

		it("deve retornar false para agendamento já cancelado", async () => {
			const scheduleData: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const created = await repository.create(scheduleData);
			await repository.cancel(created.id);

			const result = await repository.cancel(created.id);
			expect(result).toBe(false);
		});
	});

	describe("complete", () => {
		it("deve completar um agendamento agendado", async () => {
			const scheduleData: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const created = await repository.create(scheduleData);
			const result = await repository.complete(created.id);

			expect(result).toBe(true);

			const updated = await repository.findById(created.id);
			expect(updated?.status).toBe("COMPLETED");
		});

		it("deve retornar false para agendamento inexistente", async () => {
			const result = await repository.complete("non-existent-id");
			expect(result).toBe(false);
		});

		it("deve retornar false para agendamento já cancelado", async () => {
			const scheduleData: CreateScheduleDTO = {
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			};

			const created = await repository.create(scheduleData);
			await repository.cancel(created.id);

			const result = await repository.complete(created.id);
			expect(result).toBe(false);
		});
	});

	describe("métodos auxiliares", () => {
		it("deve limpar todos os agendamentos", () => {
			repository.create({
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			});

			expect(repository.count()).toBe(1);
			repository.clear();
			expect(repository.count()).toBe(0);
		});

		it("deve retornar todos os agendamentos", async () => {
			await repository.create({
				availabilityId: "availability-123",
				patientId: "patient-123",
				doctorId: "doctor-123",
				scheduledAt: new Date("2025-08-20T10:00:00.000Z"),
			});

			await repository.create({
				availabilityId: "availability-124",
				patientId: "patient-124",
				doctorId: "doctor-124",
				scheduledAt: new Date("2025-08-20T11:00:00.000Z"),
			});

			const allSchedules = repository.findAll();
			expect(allSchedules).toHaveLength(2);
		});

		it("deve gerenciar disponibilidades de teste", () => {
			repository.addAvailability({
				availabilityId: "avail-1",
				doctorId: "doctor-123",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 10,
				availableDate: new Date("2025-08-20T09:00:00.000Z"),
				isAvailable: true,
			});

			expect(repository.getAvailabilities()).toHaveLength(1);
			
			repository.clearAvailabilities();
			expect(repository.getAvailabilities()).toHaveLength(0);
		});
	});
});
