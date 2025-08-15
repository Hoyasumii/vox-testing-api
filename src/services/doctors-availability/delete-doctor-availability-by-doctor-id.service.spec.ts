import { DeleteDoctorAvailabilityByDoctorIdService } from "./delete-doctor-availability-by-doctor-id.service";
import { DoctorsAvailabilityRepository } from "../../../test/repositories/doctors-availability.repository";
import type { CreateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";

describe("DeleteDoctorAvailabilityByDoctorIdService", () => {
	let service: DeleteDoctorAvailabilityByDoctorIdService;
	let repository: DoctorsAvailabilityRepository;

	beforeEach(() => {
		repository = new DoctorsAvailabilityRepository();
		service = new DeleteDoctorAvailabilityByDoctorIdService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("should delete all availabilities for a doctor and return count", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			const availabilities: CreateDoctorAvailabilityDTO[] = [
				{ doctorId, dayOfWeek: 1, startHour: 9, endHour: 12 },
				{ doctorId, dayOfWeek: 2, startHour: 14, endHour: 17 },
				{ doctorId, dayOfWeek: 3, startHour: 8, endHour: 16 },
			];

			for (const availability of availabilities) {
				await repository.create(availability);
			}

			expect(repository.count()).toBe(3);

			const result = await service.run(doctorId);

			expect(result).toBe(3);
			expect(repository.count()).toBe(0);

			// Verify no availabilities exist for this doctor
			const remainingAvailabilities = repository.findAll();
			expect(remainingAvailabilities.filter(a => a.doctorId === doctorId)).toHaveLength(0);
		});

		it("should return 0 when doctor has no availabilities", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";

			const result = await service.run(doctorId);

			expect(result).toBe(0);
			expect(repository.count()).toBe(0);
		});

		it("should delete only the specified doctor's availabilities", async () => {
			const doctorId1 = "550e8400-e29b-41d4-a716-446655440000";
			const doctorId2 = "550e8400-e29b-41d4-a716-446655440001";
			
			const doctor1Availabilities: CreateDoctorAvailabilityDTO[] = [
				{ doctorId: doctorId1, dayOfWeek: 1, startHour: 9, endHour: 12 },
				{ doctorId: doctorId1, dayOfWeek: 2, startHour: 14, endHour: 17 },
			];

			const doctor2Availabilities: CreateDoctorAvailabilityDTO[] = [
				{ doctorId: doctorId2, dayOfWeek: 1, startHour: 10, endHour: 13 },
				{ doctorId: doctorId2, dayOfWeek: 3, startHour: 15, endHour: 18 },
				{ doctorId: doctorId2, dayOfWeek: 5, startHour: 8, endHour: 11 },
			];

			for (const availability of [...doctor1Availabilities, ...doctor2Availabilities]) {
				await repository.create(availability);
			}

			expect(repository.count()).toBe(5);

			const result = await service.run(doctorId1);

			expect(result).toBe(2);
			expect(repository.count()).toBe(3);

			// Verify only doctor2's availabilities remain
			const remainingAvailabilities = repository.findAll();
			expect(remainingAvailabilities.every(a => a.doctorId === doctorId2)).toBe(true);
			expect(remainingAvailabilities).toHaveLength(3);
		});

		it("should throw BadRequestError when doctorId is invalid", async () => {
			const invalidDoctorId = "invalid-uuid";

			await expect(service.run(invalidDoctorId)).rejects.toThrow("Bad request");
		});

		it("should throw BadRequestError for empty string doctorId", async () => {
			const emptyId = "";

			await expect(service.run(emptyId)).rejects.toThrow("Bad request");
		});

		it("should throw BadRequestError for null or undefined doctorId", async () => {
			await expect(service.run(null as any)).rejects.toThrow("Bad request");
			await expect(service.run(undefined as any)).rejects.toThrow("Bad request");
		});

		it("should handle large number of availabilities for a single doctor", async () => {
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			
			// Create 20 availabilities for the same doctor
			const availabilities: CreateDoctorAvailabilityDTO[] = [];
			for (let i = 0; i < 20; i++) {
				availabilities.push({
					doctorId,
					dayOfWeek: i % 7,
					startHour: 8 + (i % 8),
					endHour: 16 + (i % 8),
				});
			}

			for (const availability of availabilities) {
				await repository.create(availability);
			}

			expect(repository.count()).toBe(20);

			const result = await service.run(doctorId);

			expect(result).toBe(20);
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

		it("should return correct count when deleting partial set", async () => {
			const doctorId1 = "550e8400-e29b-41d4-a716-446655440000";
			const doctorId2 = "550e8400-e29b-41d4-a716-446655440001";
			
			// Create 1 availability for doctor1 and 4 for doctor2
			const doctor1Availability: CreateDoctorAvailabilityDTO = {
				doctorId: doctorId1,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			const doctor2Availabilities: CreateDoctorAvailabilityDTO[] = [
				{ doctorId: doctorId2, dayOfWeek: 1, startHour: 8, endHour: 12 },
				{ doctorId: doctorId2, dayOfWeek: 2, startHour: 13, endHour: 17 },
				{ doctorId: doctorId2, dayOfWeek: 3, startHour: 9, endHour: 15 },
				{ doctorId: doctorId2, dayOfWeek: 4, startHour: 10, endHour: 14 },
			];

			await repository.create(doctor1Availability);
			for (const availability of doctor2Availabilities) {
				await repository.create(availability);
			}

			expect(repository.count()).toBe(5);

			const result = await service.run(doctorId1);

			expect(result).toBe(1);
			expect(repository.count()).toBe(4);
		});
	});
});
