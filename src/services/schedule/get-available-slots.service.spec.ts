import { GetAvailableSlotsSerice } from "./get-available-slots.service";
import { ScheduleRepository } from "t/repositories/schedule.repository";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import { randomUUID } from "node:crypto";

describe("GetAvailableSlotsSerice", () => {
	let service: GetAvailableSlotsSerice;
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
		service = new GetAvailableSlotsSerice(repository);
	});

	afterEach(() => {
		repository.clear();
		repository.clearAvailabilities();
	});

	describe("run", () => {
		it("deve retornar slots disponíveis para um médico", async () => {
			// Arrange
			const doctorId = randomUUID();
			const availabilityId = randomUUID();
			const startDate = new Date("2025-08-20T00:00:00Z");
			const endDate = new Date("2025-08-20T23:59:59Z");
			const availableDate = new Date("2025-08-20T10:00:00Z");

			// Adicionar disponibilidade para o médico
			repository.addAvailability({
				availabilityId,
				doctorId,
				dayOfWeek: availableDate.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate,
				isAvailable: true,
			});

			// Act
			const result = await service.run({
				doctorId,
				startDate,
				endDate,
			});

			// Assert
			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						availabilityId,
						doctorId,
						availableDate,
						isAvailable: true,
					}),
				])
			);
		});

		it("deve retornar array vazio quando médico não tem disponibilidades", async () => {
			// Arrange
			const doctorId = randomUUID();
			const startDate = new Date("2025-08-20T00:00:00Z");
			const endDate = new Date("2025-08-20T23:59:59Z");

			// Act
			const result = await service.run({
				doctorId,
				startDate,
				endDate,
			});

			// Assert
			expect(result).toEqual([]);
		});

		it("deve retornar bad request para doctorId inválido", async () => {
			// Arrange
			const invalidDoctorId = "invalid-uuid";
			const startDate = new Date("2025-08-20T00:00:00Z");
			const endDate = new Date("2025-08-20T23:59:59Z");

			// Act & Assert
			await expect(
				service.run({
					doctorId: invalidDoctorId as any,
					startDate,
					endDate,
				})
			).rejects.toThrow();
		});

		it("deve usar data atual como padrão quando startDate não for fornecida", async () => {
			// Arrange
			const doctorId = randomUUID();
			const availabilityId = randomUUID();
			const now = new Date();

			repository.addAvailability({
				availabilityId,
				doctorId,
				dayOfWeek: now.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: now,
				isAvailable: true,
			});

			// Act
			const result = await service.run({
				doctorId,
				endDate: new Date(now.getTime() + 1000), // 1 segundo depois para criar um range
			});

			// Assert
			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						availabilityId,
						doctorId,
						isAvailable: true,
					}),
				])
			);
		});

		it("deve usar data atual como padrão quando endDate não for fornecida", async () => {
			// Arrange
			const doctorId = randomUUID();
			const availabilityId = randomUUID();
			const now = new Date();

			repository.addAvailability({
				availabilityId,
				doctorId,
				dayOfWeek: now.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: now,
				isAvailable: true,
			});

			// Act
			const result = await service.run({
				doctorId,
				startDate: new Date(now.getTime() - 1000), // 1 segundo antes para criar um range
			});

			// Assert
			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						availabilityId,
						doctorId,
						isAvailable: true,
					}),
				])
			);
		});

		it("deve filtrar slots por período específico", async () => {
			// Arrange
			const doctorId = randomUUID();
			const availability1Id = randomUUID();
			const availability2Id = randomUUID();
			const availability3Id = randomUUID();

			const date1 = new Date("2025-08-20T10:00:00Z");
			const date2 = new Date("2025-08-21T10:00:00Z");
			const date3 = new Date("2025-08-22T10:00:00Z");

			// Adicionar múltiplas disponibilidades
			repository.addAvailability({
				availabilityId: availability1Id,
				doctorId,
				dayOfWeek: date1.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: date1,
				isAvailable: true,
			});

			repository.addAvailability({
				availabilityId: availability2Id,
				doctorId,
				dayOfWeek: date2.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: date2,
				isAvailable: true,
			});

			repository.addAvailability({
				availabilityId: availability3Id,
				doctorId,
				dayOfWeek: date3.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: date3,
				isAvailable: true,
			});

			// Act - buscar apenas slots do dia 21
			const result = await service.run({
				doctorId,
				startDate: new Date("2025-08-21T00:00:00Z"),
				endDate: new Date("2025-08-21T23:59:59Z"),
			});

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				availabilityId: availability2Id,
				doctorId,
				availableDate: date2,
				isAvailable: true,
			});
		});

		it("deve retornar apenas slots disponíveis (isAvailable: true)", async () => {
			// Arrange
			const doctorId = randomUUID();
			const availableSlotId = randomUUID();
			const unavailableSlotId = randomUUID();

			const availableDate = new Date("2025-08-20T10:00:00Z");
			const unavailableDate = new Date("2025-08-20T11:00:00Z");

			repository.addAvailability({
				availabilityId: availableSlotId,
				doctorId,
				dayOfWeek: availableDate.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate,
				isAvailable: true,
			});

			repository.addAvailability({
				availabilityId: unavailableSlotId,
				doctorId,
				dayOfWeek: unavailableDate.getDay(),
				startHour: 11,
				endHour: 12,
				availableDate: unavailableDate,
				isAvailable: false,
			});

			// Act
			const result = await service.run({
				doctorId,
				startDate: new Date("2025-08-20T00:00:00Z"),
				endDate: new Date("2025-08-20T23:59:59Z"),
			});

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				availabilityId: availableSlotId,
				isAvailable: true,
			});
		});

		it("deve retornar slots de múltiplos médicos quando chamado para médicos diferentes", async () => {
			// Arrange
			const doctor1Id = randomUUID();
			const doctor2Id = randomUUID();
			const availability1Id = randomUUID();
			const availability2Id = randomUUID();

			const availableDate = new Date("2025-08-20T10:00:00Z");
			const startDate = new Date("2025-08-20T00:00:00Z");
			const endDate = new Date("2025-08-20T23:59:59Z");

			repository.addAvailability({
				availabilityId: availability1Id,
				doctorId: doctor1Id,
				dayOfWeek: availableDate.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate,
				isAvailable: true,
			});

			repository.addAvailability({
				availabilityId: availability2Id,
				doctorId: doctor2Id,
				dayOfWeek: availableDate.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate,
				isAvailable: true,
			});

			// Act
			const result1 = await service.run({ 
				doctorId: doctor1Id,
				startDate,
				endDate
			});
			const result2 = await service.run({ 
				doctorId: doctor2Id,
				startDate,
				endDate
			});

			// Assert
			expect(result1).toHaveLength(1);
			expect(result1[0].doctorId).toBe(doctor1Id);
			expect(result1[0].availabilityId).toBe(availability1Id);

			expect(result2).toHaveLength(1);
			expect(result2[0].doctorId).toBe(doctor2Id);
			expect(result2[0].availabilityId).toBe(availability2Id);
		});
	});
});
