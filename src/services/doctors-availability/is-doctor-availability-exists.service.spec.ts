import { IsDoctorAvailabilityExistsService } from "./is-doctor-availability-exists.service";
import { DoctorsAvailabilityRepository } from "t/repositories/doctors-availability.repository";
import type { CreateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import { BadRequestError } from "@/errors";
import { MemoryCache } from "t/cache";
import { testChannel } from "t/channels";

describe("IsDoctorAvailabilityExistsService", () => {
	let service: IsDoctorAvailabilityExistsService;
	let repository: DoctorsAvailabilityRepository;
	let cache: MemoryCache;

	beforeEach(() => {
		cache = new MemoryCache();
		repository = new DoctorsAvailabilityRepository(cache, testChannel);
		service = new IsDoctorAvailabilityExistsService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("deve retornar true quando a disponibilidade existe", async () => {
			// Arrange
			const availabilityData: CreateDoctorAvailabilityDTO = {
				doctorId: "550e8400-e29b-41d4-a716-446655440000",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 12,
			};

			await repository.create(availabilityData);
			const createdAvailability = repository.findAll()[0];

			// Act
			const result = await service.run(createdAvailability.id);

			// Assert
			expect(result).toBe(true);
		});

		it("deve retornar false quando a disponibilidade não existe", async () => {
			// Arrange
			const nonExistentId = "550e8400-e29b-41d4-a716-446655440999";

			// Act
			const result = await service.run(nonExistentId);

			// Assert
			expect(result).toBe(false);
		});

		it("deve retornar BadRequestError quando o id não é um UUID válido", async () => {
			// Arrange
			const invalidId = "invalid-uuid";

			// Act & Assert
			await expect(service.run(invalidId)).rejects.toThrow(BadRequestError);
		});

		it("deve retornar BadRequestError quando o id está vazio", async () => {
			// Arrange
			const emptyId = "";

			// Act & Assert
			await expect(service.run(emptyId)).rejects.toThrow(BadRequestError);
		});

		it("deve retornar false para múltiplas disponibilidades quando o id específico não existe", async () => {
			// Arrange
			const availabilityData1: CreateDoctorAvailabilityDTO = {
				doctorId: "550e8400-e29b-41d4-a716-446655440001",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 12,
			};

			const availabilityData2: CreateDoctorAvailabilityDTO = {
				doctorId: "550e8400-e29b-41d4-a716-446655440002",
				dayOfWeek: 2,
				startHour: 14,
				endHour: 17,
			};

			await repository.create(availabilityData1);
			await repository.create(availabilityData2);

			const nonExistentId = "550e8400-e29b-41d4-a716-446655440999";

			// Act
			const result = await service.run(nonExistentId);

			// Assert
			expect(result).toBe(false);
		});

		it("deve distinguir entre diferentes UUIDs válidos", async () => {
			// Arrange
			const availabilityData1: CreateDoctorAvailabilityDTO = {
				doctorId: "550e8400-e29b-41d4-a716-446655440001",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 12,
			};

			const availabilityData2: CreateDoctorAvailabilityDTO = {
				doctorId: "550e8400-e29b-41d4-a716-446655440002",
				dayOfWeek: 2,
				startHour: 14,
				endHour: 17,
			};

			await repository.create(availabilityData1);
			await repository.create(availabilityData2);

			const availabilities = repository.findAll();
			const existingId = availabilities[0].id;
			const anotherExistingId = availabilities[1].id;
			const nonExistentId = "550e8400-e29b-41d4-a716-446655440999";

			// Act
			const existsResult1 = await service.run(existingId);
			const existsResult2 = await service.run(anotherExistingId);
			const notExistsResult = await service.run(nonExistentId);

			// Assert
			expect(existsResult1).toBe(true);
			expect(existsResult2).toBe(true);
			expect(notExistsResult).toBe(false);
		});

		it("deve verificar disponibilidade específica após deletar outras", async () => {
			// Arrange
			const availabilityData1: CreateDoctorAvailabilityDTO = {
				doctorId: "550e8400-e29b-41d4-a716-446655440001",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 12,
			};

			const availabilityData2: CreateDoctorAvailabilityDTO = {
				doctorId: "550e8400-e29b-41d4-a716-446655440002",
				dayOfWeek: 2,
				startHour: 14,
				endHour: 17,
			};

			await repository.create(availabilityData1);
			await repository.create(availabilityData2);

			const availabilities = repository.findAll();
			const keepId = availabilities[0].id;
			const deleteId = availabilities[1].id;

			await repository.deleteById(deleteId);

			// Act
			const existsResult = await service.run(keepId);
			const deletedResult = await service.run(deleteId);

			// Assert
			expect(existsResult).toBe(true);
			expect(deletedResult).toBe(false);
		});
	});
});
