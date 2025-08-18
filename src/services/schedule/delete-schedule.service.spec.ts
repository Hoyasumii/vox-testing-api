import { DeleteScheduleService } from "./delete-schedule.service";
import { ScheduleRepository } from "t/repositories/schedule.repository";
import { CreateScheduleDTO } from "@/dtos/schedules";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import { randomUUID } from "node:crypto";

describe("DeleteScheduleService", () => {
	let service: DeleteScheduleService;
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
		service = new DeleteScheduleService(repository);
	});

	afterEach(() => {
		repository.clear();
		repository.clearAvailabilities();
	});

	describe("run", () => {
		it("deve deletar um agendamento com sucesso", async () => {
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
			expect(repository.count()).toBe(1);

			// Act
			const result = await service.run(createdSchedule.id);

			// Assert
			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
			
			// Verificar se o agendamento foi realmente deletado
			const deletedSchedule = await repository.findById(createdSchedule.id);
			expect(deletedSchedule).toBeNull();
		});

		it("deve retornar false quando tentar deletar um agendamento inexistente", async () => {
			// Arrange
			const nonExistentId = randomUUID();

			// Act
			const result = await service.run(nonExistentId);

			// Assert
			expect(result).toBe(false);
			expect(repository.count()).toBe(0);
		});

		it("deve conseguir deletar múltiplos agendamentos", async () => {
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
			expect(repository.count()).toBe(2);

			// Act
			const result1 = await service.run(schedule1.id);
			const result2 = await service.run(schedule2.id);

			// Assert
			expect(result1).toBe(true);
			expect(result2).toBe(true);
			expect(repository.count()).toBe(0);

			const deletedSchedule1 = await repository.findById(schedule1.id);
			const deletedSchedule2 = await repository.findById(schedule2.id);
			
			expect(deletedSchedule1).toBeNull();
			expect(deletedSchedule2).toBeNull();
		});

		it("deve deletar um agendamento mesmo se ele estiver cancelado", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);
			
			// Cancelar o agendamento primeiro
			await repository.cancel(schedule.id);
			expect(repository.count()).toBe(1);

			// Act
			const result = await service.run(schedule.id);

			// Assert
			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
			
			const deletedSchedule = await repository.findById(schedule.id);
			expect(deletedSchedule).toBeNull();
		});

		it("deve deletar um agendamento mesmo se ele estiver completado", async () => {
			// Arrange
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);
			
			// Completar o agendamento primeiro
			await repository.complete(schedule.id);
			expect(repository.count()).toBe(1);

			// Act
			const result = await service.run(schedule.id);

			// Assert
			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
			
			const deletedSchedule = await repository.findById(schedule.id);
			expect(deletedSchedule).toBeNull();
		});

		it("deve retornar false ao tentar deletar o mesmo ID múltiplas vezes", async () => {
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
			expect(result1).toBe(true);
			expect(result2).toBe(false);
			expect(result3).toBe(false);
			expect(repository.count()).toBe(0);
		});

		it("deve manter outros agendamentos quando deletar um específico", async () => {
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
			expect(repository.count()).toBe(2);

			// Act - deletar apenas o primeiro
			const result = await service.run(schedule1.id);

			// Assert
			expect(result).toBe(true);
			expect(repository.count()).toBe(1);
			
			const deletedSchedule = await repository.findById(schedule1.id);
			const remainingSchedule = await repository.findById(schedule2.id);
			
			expect(deletedSchedule).toBeNull();
			expect(remainingSchedule).not.toBeNull();
			expect(remainingSchedule?.id).toBe(schedule2.id);
		});
	});
});
