import { CreateDoctorAvailabilityDTO } from "./create-doctor-availability.dto";

describe("CreateDoctorAvailabilityDTO", () => {
	describe("Valid data", () => {
		it("should validate a valid doctor availability creation", () => {
			const validData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 1,
				startHour: 8,
				endHour: 17,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate minimum boundary values", () => {
			const validData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 0,
				startHour: 0,
				endHour: 0,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate maximum boundary values", () => {
			const validData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 6,
				startHour: 23,
				endHour: 23,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});
	});

	describe("Invalid data", () => {
		it("should reject invalid UUID format", () => {
			const invalidData = {
				doctorId: "invalid-uuid",
				dayOfWeek: 1,
				startHour: 8,
				endHour: 17,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject dayOfWeek less than 0", () => {
			const invalidData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: -1,
				startHour: 8,
				endHour: 17,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject dayOfWeek greater than 6", () => {
			const invalidData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 7,
				startHour: 8,
				endHour: 17,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject startHour less than 0", () => {
			const invalidData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 1,
				startHour: -1,
				endHour: 17,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject startHour greater than 23", () => {
			const invalidData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 1,
				startHour: 24,
				endHour: 17,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject endHour less than 0", () => {
			const invalidData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 1,
				startHour: 8,
				endHour: -1,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject endHour greater than 23", () => {
			const invalidData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 1,
				startHour: 8,
				endHour: 24,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject missing required fields", () => {
			const incompleteData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 1,
				// missing startHour and endHour
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(incompleteData);
			expect(result.success).toBe(false);
		});

		it("should reject non-integer dayOfWeek", () => {
			const invalidData = {
				doctorId: "123e4567-e89b-12d3-a456-426614174000",
				dayOfWeek: 1.5,
				startHour: 8,
				endHour: 17,
			};

			const result = CreateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});
