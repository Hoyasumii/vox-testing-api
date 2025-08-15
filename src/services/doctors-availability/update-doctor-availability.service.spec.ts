import { UpdateDoctorAvailabilityService } from "./update-doctor-availability.service";
import { DoctorsAvailabilityRepository } from "../../../test/repositories/doctors-availability.repository";
import type { CreateDoctorAvailabilityDTO, UpdateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import { MemoryCache } from "../../../test/cache/memory-cache";

describe("UpdateDoctorAvailabilityService", () => {
	let service: UpdateDoctorAvailabilityService;
	let repository: DoctorsAvailabilityRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new DoctorsAvailabilityRepository(cache);
		service = new UpdateDoctorAvailabilityService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("should update doctor availability successfully with valid data", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const createData: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.create(createData);
			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;

			const updateData: UpdateDoctorAvailabilityDTO = {
				dayOfWeek: 2,
				startHour: 10,
				endHour: 18,
			};

			const result = await service.run({ id: availabilityId, content: updateData });

			expect(result).toBe(true);

			const updatedAvailability = repository.findByIdSync(availabilityId);
			expect(updatedAvailability).toMatchObject({
				id: availabilityId,
				doctorId,
				dayOfWeek: 2,
				startHour: 10,
				endHour: 18,
			});
		});

		it("should update only specified fields", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const createData: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.create(createData);
			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;

			const updateData: UpdateDoctorAvailabilityDTO = {
				startHour: 8,
			};

			const result = await service.run({ id: availabilityId, content: updateData });

			expect(result).toBe(true);

			const updatedAvailability = repository.findByIdSync(availabilityId);
			expect(updatedAvailability).toMatchObject({
				id: availabilityId,
				doctorId,
				dayOfWeek: 1, // unchanged
				startHour: 8, // updated
				endHour: 17, // unchanged
			});
		});

		it("should return false when availability id does not exist", async () => {
			const nonExistentId = "550e8400-e29b-41d4-a716-446655440000";
			const updateData: UpdateDoctorAvailabilityDTO = {
				dayOfWeek: 2,
			};

			const result = await service.run({ id: nonExistentId, content: updateData });

			expect(result).toBe(false);
		});

		it("should throw BadRequestError when id is invalid", async () => {
			const invalidId = "invalid-uuid";
			const updateData: UpdateDoctorAvailabilityDTO = {
				dayOfWeek: 2,
			};

			await expect(service.run({ id: invalidId, content: updateData })).rejects.toThrow("Bad request");
		});

		it("should throw BadRequestError when content is invalid", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const createData: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.create(createData);
			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;

			const invalidUpdateData = {
				dayOfWeek: 7, // Invalid: should be 0-6
			};

			await expect(service.run({ 
				id: availabilityId, 
				content: invalidUpdateData as UpdateDoctorAvailabilityDTO 
			})).rejects.toThrow("Bad request");

			// Verify data remains unchanged
			const availability = repository.findByIdSync(availabilityId);
			expect(availability).toMatchObject({
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			});
		});

		it("should throw BadRequestError when both id and content are invalid", async () => {
			const invalidId = "invalid-uuid";
			const invalidUpdateData = {
				startHour: -1, // Invalid: should be 0-23
			};

			await expect(service.run({ 
				id: invalidId, 
				content: invalidUpdateData as UpdateDoctorAvailabilityDTO 
			})).rejects.toThrow("Bad request");
		});

		it("should handle empty update content", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const createData: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.create(createData);
			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;

			const emptyUpdateData: UpdateDoctorAvailabilityDTO = {};

			const result = await service.run({ id: availabilityId, content: emptyUpdateData });

			expect(result).toBe(true);

			// Verify data remains unchanged when no fields are provided
			const availability = repository.findByIdSync(availabilityId);
			expect(availability).toMatchObject({
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			});
		});

		it("should throw BadRequestError for invalid field values", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const createData: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.create(createData);
			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;

			// Test invalid dayOfWeek
			const invalidDayData = { dayOfWeek: 8 };
			await expect(service.run({ 
				id: availabilityId, 
				content: invalidDayData as UpdateDoctorAvailabilityDTO 
			})).rejects.toThrow("Bad request");

			// Test invalid startHour
			const invalidStartData = { startHour: 23 }; // Now max is 22
			await expect(service.run({ 
				id: availabilityId, 
				content: invalidStartData as UpdateDoctorAvailabilityDTO 
			})).rejects.toThrow("Bad request");

			// Test invalid endHour
			const invalidEndData = { endHour: -5 };
			await expect(service.run({ 
				id: availabilityId, 
				content: invalidEndData as UpdateDoctorAvailabilityDTO 
			})).rejects.toThrow("Bad request");
		});

		it("should throw BadRequestError when endHour is not greater than startHour in update", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const createData: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.create(createData);
			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;

			// Test updating both startHour and endHour with invalid relationship
			const invalidTimeData = { 
				startHour: 15,
				endHour: 10 // endHour should be greater than startHour
			};
			
			await expect(service.run({ 
				id: availabilityId, 
				content: invalidTimeData as UpdateDoctorAvailabilityDTO 
			})).rejects.toThrow("Bad request");
		});
	});
});
