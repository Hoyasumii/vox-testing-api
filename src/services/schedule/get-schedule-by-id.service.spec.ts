import { GetScheduleByIdService } from "./get-schedule-by-id.service";
import { ScheduleRepository } from "t/repositories/schedule.repository";
import { CreateScheduleDTO } from "@/dtos/schedules";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import { randomUUID } from "node:crypto";

describe("GetScheduleByIdService", () => {
	let service: GetScheduleByIdService;
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
		service = new GetScheduleByIdService(repository);
	});

	afterEach(() => {
		repository.clear();
		repository.clearAvailabilities();
	});

	describe("run", () => {
		it("deve retornar agendamento específico por ID", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			const createdSchedule = await repository.create(scheduleData);

			// Act
			const result = await service.run(createdSchedule.id);

			// Assert
			expect(result).toMatchObject({
				id: createdSchedule.id,
				status: "SCHEDULED",
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			});
		});

		it("deve retornar not found para agendamento inexistente", async () => {
			// Arrange
			const nonExistentId = randomUUID();

			// Act & Assert
			await expect(service.run(nonExistentId)).rejects.toThrow();
		});

		it("deve retornar bad request para ID inválido", async () => {
			// Arrange
			const invalidId = "invalid-uuid";

			// Act & Assert
			await expect(service.run(invalidId as any)).rejects.toThrow();
		});

		it("deve retornar agendamento mesmo se estiver cancelado", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const createdSchedule = await repository.create(scheduleData);
			await repository.cancel(createdSchedule.id);

			// Act
			const result = await service.run(createdSchedule.id);

			// Assert
			expect(result).toMatchObject({
				id: createdSchedule.id,
				status: "CANCELED",
				availabilityId: scheduleData.availabilityId,
				patientId: scheduleData.patientId,
				doctorId: scheduleData.doctorId,
				scheduledAt: scheduleData.scheduledAt,
			});
		});

		it("deve retornar agendamento mesmo se estiver completado", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const createdSchedule = await repository.create(scheduleData);
			await repository.complete(createdSchedule.id);

			// Act
			const result = await service.run(createdSchedule.id);

			// Assert
			expect(result).toMatchObject({
				id: createdSchedule.id,
				status: "COMPLETED",
				availabilityId: scheduleData.availabilityId,
				patientId: scheduleData.patientId,
				doctorId: scheduleData.doctorId,
				scheduledAt: scheduleData.scheduledAt,
			});
		});

		it("deve retornar dados completos do agendamento", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			const createdSchedule = await repository.create(scheduleData);

			// Act
			const result = await service.run(createdSchedule.id);

			// Assert
			expect(result).toEqual({
				id: expect.any(String),
				status: "SCHEDULED",
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			});
			expect(result.id).toBe(createdSchedule.id);
		});

		it("deve conseguir encontrar agendamento específico entre múltiplos", async () => {
			// Arrange
			const scheduleData1: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T11:00:00Z"),
			};

			const scheduleData3: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			};

			const schedule1 = await repository.create(scheduleData1);
			const schedule2 = await repository.create(scheduleData2);
			const schedule3 = await repository.create(scheduleData3);

			// Act
			const result = await service.run(schedule2.id);

			// Assert
			expect(result).toMatchObject({
				id: schedule2.id,
				status: "SCHEDULED",
				availabilityId: scheduleData2.availabilityId,
				patientId: scheduleData2.patientId,
				doctorId: scheduleData2.doctorId,
				scheduledAt: scheduleData2.scheduledAt,
			});
		});

		it("deve retornar not found após agendamento ser deletado", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);
			await repository.delete(schedule.id);

			// Act & Assert
			await expect(service.run(schedule.id)).rejects.toThrow();
		});

		it("deve ser consistente com múltiplas chamadas para o mesmo ID", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);

			// Act
			const result1 = await service.run(schedule.id);
			const result2 = await service.run(schedule.id);
			const result3 = await service.run(schedule.id);

			// Assert
			expect(result1).toEqual(result2);
			expect(result2).toEqual(result3);
			expect(result1.id).toBe(schedule.id);
		});

		it("deve validar formato UUID corretamente", async () => {
			// Arrange & Act & Assert
			const testCases = [
				"",
				"123",
				"abc-def-ghi",
				"not-a-uuid",
				"12345678-1234-1234-1234-123456789012z", // UUID inválido
				undefined,
				null,
			];

			for (const testCase of testCases) {
				await expect(service.run(testCase as any)).rejects.toThrow();
			}
		});

		it("deve retornar agendamento com horário futuro", async () => {
			// Arrange
			const futureDate = new Date();
			futureDate.setFullYear(futureDate.getFullYear() + 1); // Um ano no futuro

			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: futureDate,
			};

			const schedule = await repository.create(scheduleData);

			// Act
			const result = await service.run(schedule.id);

			// Assert
			expect(result).toMatchObject({
				id: schedule.id,
				scheduledAt: futureDate,
			});
		});

		it("deve retornar agendamento com horário passado", async () => {
			// Arrange
			const pastDate = new Date();
			pastDate.setFullYear(pastDate.getFullYear() - 1); // Um ano no passado

			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: pastDate,
			};

			const schedule = await repository.create(scheduleData);

			// Act
			const result = await service.run(schedule.id);

			// Assert
			expect(result).toMatchObject({
				id: schedule.id,
				scheduledAt: pastDate,
			});
		});
	});
});
