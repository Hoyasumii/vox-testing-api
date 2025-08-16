import { CreateDoctorAvailabilityService } from "./create-doctor-availability.service";
import { DoctorsAvailabilityRepository } from "t/repositories/doctors-availability.repository";
import type { CreateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import type { uuid } from "@/dtos";
import { randomUUID } from "node:crypto";
import type { ChannelBase, RepositoryBase } from "@/types";

describe("CreateDoctorAvailabilityService", () => {
	let service: CreateDoctorAvailabilityService;
	let repository: DoctorsAvailabilityRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new DoctorsAvailabilityRepository(cache, testChannel);
		service = new CreateDoctorAvailabilityService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("should create a doctor availability successfully with valid data", async () => {
			const validData: CreateDoctorAvailabilityDTO = {
				doctorId: randomUUID(),
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.channel.talk<uuid, boolean>("doctor:create", validData.doctorId)

			const result = await service.run(validData);

			expect(result).toBe(true);
			expect(repository.count()).toBe(1);

			const availabilities = repository.findAll();
			expect(availabilities[0]).toMatchObject({
				doctorId: validData.doctorId,
				dayOfWeek: validData.dayOfWeek,
				startHour: validData.startHour,
				endHour: validData.endHour,
			});
		});

		it("should throw BadRequestError when doctorId is invalid", async () => {
			const invalidData = {
				doctorId: "invalid-uuid",
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await expect(service.run(invalidData as CreateDoctorAvailabilityDTO)).rejects.toThrow("Bad request");
			expect(repository.count()).toBe(0);
		});

		it("should throw BadRequestError when dayOfWeek is invalid", async () => {
			const invalidData = {
				doctorId: "550e8400-e29b-41d4-a716-446655440000",
				dayOfWeek: 7, // Invalid: should be 0-6
				startHour: 9,
				endHour: 17,
			};

			await expect(service.run(invalidData as CreateDoctorAvailabilityDTO)).rejects.toThrow("Bad request");
			expect(repository.count()).toBe(0);
		});

		it("should throw BadRequestError when startHour is invalid", async () => {
			const invalidData = {
				doctorId: "550e8400-e29b-41d4-a716-446655440000",
				dayOfWeek: 1,
				startHour: 23, // Invalid: should be 0-22
				endHour: 17,
			};

			await expect(service.run(invalidData as CreateDoctorAvailabilityDTO)).rejects.toThrow("Bad request");
			expect(repository.count()).toBe(0);
		});

		it("should throw BadRequestError when endHour is invalid", async () => {
			const invalidData = {
				doctorId: "550e8400-e29b-41d4-a716-446655440000",
				dayOfWeek: 1,
				startHour: 9,
				endHour: -1, // Invalid: should be 0-23
			};

			await expect(service.run(invalidData as CreateDoctorAvailabilityDTO)).rejects.toThrow("Bad request");
			expect(repository.count()).toBe(0);
		});

		it("should throw BadRequestError when endHour is not greater than startHour", async () => {
			const invalidData = {
				doctorId: "550e8400-e29b-41d4-a716-446655440000",
				dayOfWeek: 1,
				startHour: 17,
				endHour: 9, // Invalid: endHour should be greater than startHour
			};

			await expect(service.run(invalidData as CreateDoctorAvailabilityDTO)).rejects.toThrow("Bad request");
			expect(repository.count()).toBe(0);
		});

		it("should throw BadRequestError when endHour equals startHour", async () => {
			const invalidData = {
				doctorId: "550e8400-e29b-41d4-a716-446655440000",
				dayOfWeek: 1,
				startHour: 15,
				endHour: 15, // Invalid: endHour should be greater than startHour
			};

			await expect(service.run(invalidData as CreateDoctorAvailabilityDTO)).rejects.toThrow("Bad request");
			expect(repository.count()).toBe(0);
		});

		it("should handle repository errors gracefully", async () => {
			const validData: CreateDoctorAvailabilityDTO = {
				doctorId: randomUUID(),
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			await repository.channel.talk<uuid, boolean>("doctor:create", validData.doctorId)

			// Mock repository to throw an error
			jest.spyOn(repository, "create").mockRejectedValueOnce(new Error("Database error"));

			const result = await service.run(validData);

			expect(result).toBe(false);
		});

		it("should create multiple availabilities for the same doctor", async () => {
			const doctorId = randomUUID();

			await repository.channel.talk<uuid, boolean>("doctor:create", doctorId);
			
			const availability1: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 12,
			};

			const availability2: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1,
				startHour: 14,
				endHour: 17,
			};

			const result1 = await service.run(availability1);
			const result2 = await service.run(availability2);

			expect(result1).toBe(true);
			expect(result2).toBe(true);
			expect(repository.count()).toBe(2);

			const availabilities = repository.findAll();
			expect(availabilities).toHaveLength(2);
			expect(availabilities.every(a => a.doctorId === doctorId)).toBe(true);
		});
	});
});