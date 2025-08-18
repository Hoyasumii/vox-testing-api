import { CompleteScheduleService } from "./complete-schedule.service";
import { ScheduleRepository } from "t/repositories/schedule.repository";
import { CreateScheduleDTO } from "@/dtos/schedules";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import { randomUUID } from "node:crypto";

describe("CompleteScheduleService", () => {
	let service: CompleteScheduleService;
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
		service = new CompleteScheduleService(repository);
	});

	afterEach(() => {
		repository.clear();
		repository.clearAvailabilities();
	});

	describe("run", () => {
		it("deve completar um agendamento com sucesso", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			// Criar um agendamento primeiro
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
			expect(result).toBe(true);
			
			// Verificar se o agendamento foi completado
			const completedSchedule = await repository.findById(createdSchedule.id);
			expect(completedSchedule?.status).toBe("COMPLETED");
		});

		it("deve retornar false quando tentar completar um agendamento inexistente", async () => {
			// Arrange
			const nonExistentId = randomUUID();

			// Act
			const result = await service.run(nonExistentId);

			// Assert
			expect(result).toBe(false);
		});

		it("deve retornar bad request para ID inválido", async () => {
			// Arrange
			const invalidId = "invalid-uuid";

			// Act & Assert
			await expect(service.run(invalidId as any)).rejects.toThrow();
		});

		it("deve retornar false quando o ID é válido mas o agendamento não existe", async () => {
			// Arrange
			const validButNonExistentId = randomUUID();

			// Act
			const result = await service.run(validButNonExistentId);

			// Assert
			expect(result).toBe(false);
		});

		it("deve conseguir completar múltiplos agendamentos", async () => {
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

			const schedule1 = await repository.create(scheduleData1);
			const schedule2 = await repository.create(scheduleData2);

			// Act
			const result1 = await service.run(schedule1.id);
			const result2 = await service.run(schedule2.id);

			// Assert
			expect(result1).toBe(true);
			expect(result2).toBe(true);

			const completedSchedule1 = await repository.findById(schedule1.id);
			const completedSchedule2 = await repository.findById(schedule2.id);
			
			expect(completedSchedule1?.status).toBe("COMPLETED");
			expect(completedSchedule2?.status).toBe("COMPLETED");
		});

		it("deve retornar false ao tentar completar um agendamento já completado", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);
			
			// Completar uma primeira vez
			await service.run(schedule.id);

			// Act - tentar completar novamente
			const result = await service.run(schedule.id);

			// Assert
			expect(result).toBe(false);
		});

		it("deve permitir completar um agendamento que foi cancelado e depois reagendado", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);
			
			// Cancelar o agendamento
			await repository.cancel(schedule.id);
			
			// Criar novo agendamento
			const newSchedule = await repository.create(scheduleData);

			// Act
			const result = await service.run(newSchedule.id);

			// Assert
			expect(result).toBe(true);
			
			const completedSchedule = await repository.findById(newSchedule.id);
			expect(completedSchedule?.status).toBe("COMPLETED");
		});
	});
});
