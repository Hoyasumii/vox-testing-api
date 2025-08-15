import { UpdateDoctorAvailabilityDTO } from "./update-doctor-availability.dto";

describe("UpdateDoctorAvailabilityDTO", () => {
	describe("Valid data", () => {
		it("should validate partial update with all fields", () => {
			const validData = {
				dayOfWeek: 1,
				startHour: 8,
				endHour: 17,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate partial update with only dayOfWeek", () => {
			const validData = {
				dayOfWeek: 3,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate partial update with only startHour", () => {
			const validData = {
				startHour: 9,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate partial update with only endHour", () => {
			const validData = {
				endHour: 18,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate empty object (no updates)", () => {
			const validData = {};

			const result = UpdateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate minimum boundary values", () => {
			const validData = {
				dayOfWeek: 0,
				startHour: 0,
				endHour: 0,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});

		it("should validate maximum boundary values", () => {
			const validData = {
				dayOfWeek: 6,
				startHour: 23,
				endHour: 23,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(validData);
			expect(result.success).toBe(true);
		});
	});

	describe("Invalid data", () => {
		it("should reject dayOfWeek less than 0", () => {
			const invalidData = {
				dayOfWeek: -1,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject dayOfWeek greater than 6", () => {
			const invalidData = {
				dayOfWeek: 7,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject startHour less than 0", () => {
			const invalidData = {
				startHour: -1,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject startHour greater than 23", () => {
			const invalidData = {
				startHour: 24,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject endHour less than 0", () => {
			const invalidData = {
				endHour: -1,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject endHour greater than 23", () => {
			const invalidData = {
				endHour: 24,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject non-integer dayOfWeek", () => {
			const invalidData = {
				dayOfWeek: 1.5,
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});

		it("should reject invalid types", () => {
			const invalidData = {
				dayOfWeek: "monday",
				startHour: "eight",
				endHour: "five",
			};

			const result = UpdateDoctorAvailabilityDTO.safeParse(invalidData);
			expect(result.success).toBe(false);
		});
	});
});
