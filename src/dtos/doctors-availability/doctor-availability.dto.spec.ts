import { DoctorAvailabilityDTO } from "./doctor-availability.dto";

describe("DoctorAvailabilityDTO", () => {
	describe("Valid data", () => {
		it("should validate a complete doctor availability object", () => {
			const validData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 1,
				startHour: 8,
				endHour: 17,
			};

			const result = DoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate minimum boundary values", () => {
			const validData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 0,
				startHour: 0,
				endHour: 0,
			};

			const result = DoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate maximum boundary values", () => {
			const validData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 6,
				startHour: 23,
				endHour: 23,
			};

			const result = DoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});
	});

	describe("Invalid data", () => {
		it("should reject invalid id UUID format", () => {
			const invalidData = {
				id: "invalid-uuid",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 1,
				startHour: 8,
				endHour: 17,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject invalid doctorId UUID format", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "invalid-uuid",
				dayOfWeek: 1,
				startHour: 8,
				endHour: 17,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject dayOfWeek less than 0", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: -1,
				startHour: 8,
				endHour: 17,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject dayOfWeek greater than 6", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 7,
				startHour: 8,
				endHour: 17,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject startHour less than 0", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 1,
				startHour: -1,
				endHour: 17,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject startHour greater than 23", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 1,
				startHour: 24,
				endHour: 17,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject endHour less than 0", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 1,
				startHour: 8,
				endHour: -1,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject endHour greater than 23", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 1,
				startHour: 8,
				endHour: 24,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject missing required fields", () => {
			const incompleteData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				// missing doctorId, dayOfWeek, startHour, endHour
			};

			const result = DoctorAvailabilityDTO.safeParse(incompleteData);
			expect(result.success).toBe(false);
		});

		it("should reject non-integer dayOfWeek", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: 1.5,
				startHour: 8,
				endHour: 17,
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject invalid types", () => {
			const invalidData = {
				id: "123e4567-e89b-12d3-a456-426614174000",
				doctorId: "987fcdeb-51a2-43b8-9876-543210987654",
				dayOfWeek: "monday",
				startHour: "eight",
				endHour: "five",
			};

			const result = DoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});
