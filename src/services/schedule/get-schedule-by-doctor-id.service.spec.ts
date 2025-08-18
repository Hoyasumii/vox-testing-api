import { GetScheduleByDoctorIdService } from "./get-schedule-by-doctor-id.service";
import { ScheduleRepository } from "t/repositories/schedule.repository";
import { CreateScheduleDTO } from "@/dtos/schedules";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import { randomUUID } from "node:crypto";

describe("GetScheduleByDoctorIdService", () => {
	let service: GetScheduleByDoctorIdService;
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
		service = new GetScheduleByDoctorIdService(repository);
	});

	afterEach(() => {
		repository.clear();
		repository.clearAvailabilities();
	});

	describe("run", () => {
		it("deve retornar agendamentos de um médico específico", async () => {
			// Arrange
			const doctorId = randomUUID();
			const otherDoctorId = randomUUID();
			const patientId = randomUUID();

			const scheduleData1: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId,
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId,
				scheduledAt: new Date("2025-08-20T11:00:00Z"),
			};

			const scheduleDataOtherDoctor: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: otherDoctorId,
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			};

			await repository.create(scheduleData1);
			await repository.create(scheduleData2);
			await repository.create(scheduleDataOtherDoctor);

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toHaveLength(2);
			expect(result.every(schedule => schedule.doctorId === doctorId)).toBe(true);
			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						doctorId,
						patientId,
						scheduledAt: scheduleData1.scheduledAt,
					}),
					expect.objectContaining({
						doctorId,
						scheduledAt: scheduleData2.scheduledAt,
					}),
				])
			);
		});

		it("deve retornar array vazio quando médico não tem agendamentos", async () => {
			// Arrange
			const doctorId = randomUUID();
			const otherDoctorId = randomUUID();

			// Criar agendamento para outro médico
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: otherDoctorId,
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			await repository.create(scheduleData);

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toEqual([]);
		});

		it("deve retornar bad request para doctorId inválido", async () => {
			// Arrange
			const invalidDoctorId = "invalid-uuid";

			// Act & Assert
			await expect(service.run(invalidDoctorId as any)).rejects.toThrow();
		});

		it("deve retornar array vazio para médico que existe mas não tem agendamentos", async () => {
			// Arrange
			const doctorId = randomUUID();

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toEqual([]);
		});

		it("deve retornar agendamentos em todos os status", async () => {
			// Arrange
			const doctorId = randomUUID();

			const scheduleData1: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId,
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId,
				scheduledAt: new Date("2025-08-20T11:00:00Z"),
			};

			const scheduleData3: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId,
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			};

			const schedule1 = await repository.create(scheduleData1);
			const schedule2 = await repository.create(scheduleData2);
			const schedule3 = await repository.create(scheduleData3);

			// Alterar status dos agendamentos
			await repository.cancel(schedule2.id);
			await repository.complete(schedule3.id);

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toHaveLength(3);
			
			const scheduledCount = result.filter(s => s.status === "SCHEDULED").length;
			const canceledCount = result.filter(s => s.status === "CANCELED").length;
			const completedCount = result.filter(s => s.status === "COMPLETED").length;
			
			expect(scheduledCount).toBe(1);
			expect(canceledCount).toBe(1);
			expect(completedCount).toBe(1);
		});

		it("deve retornar agendamentos ordenados por data de agendamento", async () => {
			// Arrange
			const doctorId = randomUUID();

			const scheduleData1: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId,
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId,
				scheduledAt: new Date("2025-08-20T08:00:00Z"),
			};

			const scheduleData3: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId,
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			await repository.create(scheduleData1);
			await repository.create(scheduleData2);
			await repository.create(scheduleData3);

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toHaveLength(3);
			expect(result[0].scheduledAt).toEqual(scheduleData2.scheduledAt);
			expect(result[1].scheduledAt).toEqual(scheduleData3.scheduledAt);
			expect(result[2].scheduledAt).toEqual(scheduleData1.scheduledAt);
		});

		it("deve retornar agendamentos com informações completas", async () => {
			// Arrange
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const availabilityId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			const createdSchedule = await repository.create(scheduleData);

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				id: createdSchedule.id,
				status: "SCHEDULED",
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			});
		});

		it("deve retornar apenas agendamentos do médico especificado mesmo com múltiplos médicos", async () => {
			// Arrange
			const doctorId = randomUUID();
			const doctor2Id = randomUUID();
			const doctor3Id = randomUUID();

			// Criar agendamentos para diferentes médicos
			await repository.create({
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: doctorId,
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			});

			await repository.create({
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: doctor2Id,
				scheduledAt: new Date("2025-08-20T11:00:00Z"),
			});

			await repository.create({
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: doctorId,
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			});

			await repository.create({
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: doctor3Id,
				scheduledAt: new Date("2025-08-20T13:00:00Z"),
			});

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toHaveLength(2);
			expect(result.every(schedule => schedule.doctorId === doctorId)).toBe(true);
		});
	});
});
