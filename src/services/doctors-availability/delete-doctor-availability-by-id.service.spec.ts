import { DeleteDoctorAvailabilityByIdService } from "./delete-doctor-availability-by-id.service";
import { DoctorsAvailabilityRepository } from "t/repositories/doctors-availability.repository";
import type { CreateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import { MemoryCache } from "t/cache/memory-cache";
import { NotFoundError } from "@/errors";
import { testChannel } from "t/channels";

describe("DeleteDoctorAvailabilityByIdService", () => {
	let service: DeleteDoctorAvailabilityByIdService;
	let repository: DoctorsAvailabilityRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new DoctorsAvailabilityRepository(cache, testChannel);
		service = new DeleteDoctorAvailabilityByIdService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("should delete doctor availability successfully when it exists", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const createData: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.create(createData);
			expect(repository.count()).toBe(1);

			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;

			const result = await service.run(availabilityId);

			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
			expect(repository.findByIdSync(availabilityId)).toBeNull();
		});

		it("should return false when trying to delete non-existent availability", async () => {
			const nonExistentId = "550e8400-e29b-41d4-a716-446655440000";

			await expect(service.run(nonExistentId)).rejects.toBeInstanceOf(NotFoundError);

		});

		it("should throw BadRequestError when id is invalid", async () => {
			const invalidId = "invalid-uuid";

			await expect(service.run(invalidId)).rejects.toThrow("Bad request");
		});

		it("should throw BadRequestError for empty string id", async () => {
			const emptyId = "";

			await expect(service.run(emptyId)).rejects.toThrow("Bad request");
		});

		it("should throw BadRequestError for null or undefined id", async () => {
			await expect(service.run(null as any)).rejects.toThrow("Bad request");
			await expect(service.run(undefined as any)).rejects.toThrow("Bad request");
		});

		it("should delete only the specified availability when multiple exist", async () => {
			const doctorId1 = "550e8400-e29b-41d4-a716-446655440000";
			const doctorId2 = "550e8400-e29b-41d4-a716-446655440001";
			
			const createData1: CreateDoctorAvailabilityDTO = {
				doctorId: doctorId1,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			const createData2: CreateDoctorAvailabilityDTO = {
				doctorId: doctorId2,
				dayOfWeek: 2,
				startHour: 10,
				endHour: 18,
			};

			const createData3: CreateDoctorAvailabilityDTO = {
				doctorId: doctorId1,
				dayOfWeek: 3,
				startHour: 8,
				endHour: 16,
			};

			await repository.create(createData1);
			await repository.create(createData2);
			await repository.create(createData3);

			expect(repository.count()).toBe(3);

			const availabilities = repository.findAll();
			const targetId = availabilities[1].id; // Delete the second one

			const result = await service.run(targetId);

			expect(result).toBe(true);
			expect(repository.count()).toBe(2);
			expect(repository.findByIdSync(targetId)).toBeNull();

			// Verify other availabilities still exist
			const remainingAvailabilities = repository.findAll();
			expect(remainingAvailabilities).toHaveLength(2);
			expect(remainingAvailabilities.some(a => a.id === availabilities[0].id)).toBe(true);
			expect(remainingAvailabilities.some(a => a.id === availabilities[2].id)).toBe(true);
		});

		it("should successfully delete availability with boundary values", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const createData: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 0, // Sunday
				startHour: 0, // Midnight
				endHour: 23, // 11 PM
			};

			await repository.create(createData);
			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;

			const result = await service.run(availabilityId);

			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
		});

		it("should throw BadRequestError for malformed UUID", async () => {
			const malformedIds = [
				"550e8400-e29b-41d4-a716", // Too short
				"550e8400-e29b-41d4-a716-446655440000-extra", // Too long
				"xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx", // Invalid characters
				"550e8400e29b41d4a716446655440000", // Missing hyphens
			];

			for (const malformedId of malformedIds) {
				await expect(service.run(malformedId)).rejects.toThrow("Bad request");
			}
		});
	});
});
