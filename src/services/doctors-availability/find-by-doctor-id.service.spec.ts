import { FindByDoctorIdService } from "./find-by-doctor-id.service";
import { DoctorsAvailabilityRepository } from "../../../test/repositories/doctors-availability.repository";
import type { CreateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import { MemoryCache } from "../../../test/cache/memory-cache";
import type { DoctorsAvailabilityRepositoryBase } from "@/repositories";

describe("FindByDoctorIdService", () => {
	let service: FindByDoctorIdService;
	let repository: DoctorsAvailabilityRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new DoctorsAvailabilityRepository(cache);
		service = new FindByDoctorIdService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("should return empty array when doctor has no availabilities", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";

			const result = await service.run(doctorId);

			expect(result).toEqual([]);
		});

		it("should return doctor availabilities when they exist", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const availability1: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 12,
			};

			const availability2: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 2,
				startHour: 14,
				endHour: 17,
			};

			await repository.create(availability1);
			await repository.create(availability2);

			const result = await service.run(doctorId);

			expect(result).toHaveLength(2);
			expect(result[0]).toMatchObject({
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 12,
			});
			expect(result[1]).toMatchObject({
				doctorId,
				dayOfWeek: 2,
				startHour: 14,
				endHour: 17,
			});
			expect(result[0]).toHaveProperty("id");
			expect(result[1]).toHaveProperty("id");
		});

		it("should return only availabilities for the requested doctor", async () => {
			const doctorId1 = "550e8400-e29b-41d4-a716-446655440000";
			const doctorId2 = "550e8400-e29b-41d4-a716-446655440001";
			
			const availability1: CreateDoctorAvailabilityDTO = {
				doctorId: doctorId1,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 12,
			};

			const availability2: CreateDoctorAvailabilityDTO = {
				doctorId: doctorId2,
				dayOfWeek: 1,
				startHour: 14,
				endHour: 17,
			};

			const availability3: CreateDoctorAvailabilityDTO = {
				doctorId: doctorId1,
				dayOfWeek: 3,
				startHour: 10,
				endHour: 16,
			};

			await repository.create(availability1);
			await repository.create(availability2);
			await repository.create(availability3);

			const result = await service.run(doctorId1);

			expect(result).toHaveLength(2);
			expect(result.every(a => a.doctorId === doctorId1)).toBe(true);
		});

		it("should throw BadRequestError when doctorId is invalid", async () => {
			const invalidDoctorId = "invalid-uuid";

			await expect(service.run(invalidDoctorId)).rejects.toThrow("Bad request");
		});

		it("should throw BadRequestError for empty UUID string", async () => {
			const emptyId = "";

			await expect(service.run(emptyId)).rejects.toThrow("Bad request");
		});

		it("should throw BadRequestError for null or undefined doctorId", async () => {
			await expect(service.run(null as any)).rejects.toThrow("Bad request");
			await expect(service.run(undefined as any)).rejects.toThrow("Bad request");
		});

		it("should return multiple availabilities ordered as stored", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const availabilities: CreateDoctorAvailabilityDTO[] = [
				{ doctorId, dayOfWeek: 0, startHour: 8, endHour: 12 },
				{ doctorId, dayOfWeek: 1, startHour: 9, endHour: 13 },
				{ doctorId, dayOfWeek: 2, startHour: 10, endHour: 14 },
				{ doctorId, dayOfWeek: 3, startHour: 11, endHour: 15 },
				{ doctorId, dayOfWeek: 4, startHour: 12, endHour: 16 },
			];

			for (const availability of availabilities) {
				await repository.create(availability);
			}

			const result = await service.run(doctorId);

			expect(result).toHaveLength(5);
			
			// Verify all days are present
			const dayOfWeeks = result.map(a => a.dayOfWeek);
			expect(dayOfWeeks).toEqual([0, 1, 2, 3, 4]);
		});
	});
});
