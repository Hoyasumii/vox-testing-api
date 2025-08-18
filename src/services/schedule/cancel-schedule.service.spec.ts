import { CancelScheduleService } from "./cancel-schedule.service";
import { ScheduleRepository } from "t/repositories/schedule.repository";
import { CreateScheduleDTO } from "@/dtos/schedules";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import { randomUUID } from "node:crypto";

describe("CancelScheduleService", () => {
	let service: CancelScheduleService;
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
		service = new CancelScheduleService(repository);
	});

	afterEach(() => {
		repository.clear();
		repository.clearAvailabilities();
	});

	describe("run", () => {
		it("deve cancelar um agendamento com sucesso", async () => {
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
			
			// Verificar se o agendamento foi cancelado
			const canceledSchedule = await repository.findById(createdSchedule.id);
			expect(canceledSchedule?.status).toBe("CANCELED");
		});

		it("deve retornar false quando tentar cancelar um agendamento inexistente", async () => {
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

		it("deve conseguir cancelar múltiplos agendamentos", async () => {
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

			const canceledSchedule1 = await repository.findById(schedule1.id);
			const canceledSchedule2 = await repository.findById(schedule2.id);
			
			expect(canceledSchedule1?.status).toBe("CANCELED");
			expect(canceledSchedule2?.status).toBe("CANCELED");
		});

		it("deve retornar false ao tentar cancelar um agendamento já cancelado", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);
			
			// Cancelar uma primeira vez
			await service.run(schedule.id);

			// Act - tentar cancelar novamente
			const result = await service.run(schedule.id);

			// Assert
			expect(result).toBe(false);
		});
	});
});
