import { AvailableSlotResponseDTO } from "./available-slot-response.dto";

describe("AvailableSlotResponseDTO", () => {
	const validData = {
		availabilityId: "550e8400-e29b-41d4-a716-446655440000",
		doctorId: "550e8400-e29b-41d4-a716-446655440001",
		dayOfWeek: 1, // Monday
		startHour: 9,
		endHour: 17,
		availableDate: new Date("2025-08-17T00:00:00Z"),
		isAvailable: true,
	};

	it("should validate valid available slot response data", () => {
		const result = AvailableSlotResponseDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.availabilityId).toBe(validData.availabilityId);
			expect(result.data.doctorId).toBe(validData.doctorId);
			expect(result.data.dayOfWeek).toBe(validData.dayOfWeek);
			expect(result.data.startHour).toBe(validData.startHour);
			expect(result.data.endHour).toBe(validData.endHour);
			expect(result.data.availableDate).toEqual(validData.availableDate);
			expect(result.data.isAvailable).toBe(validData.isAvailable);
		}
	});

	it("should validate with isAvailable false", () => {
		const dataWithUnavailable = {
			...validData,
			isAvailable: false,
		};

		const result = AvailableSlotResponseDTO.safeParse(dataWithUnavailable);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.isAvailable).toBe(false);
		}
	});

	it("should validate day of week 0 (Sunday)", () => {
		const dataWithSunday = {
			...validData,
			dayOfWeek: 0,
		};

		const result = AvailableSlotResponseDTO.safeParse(dataWithSunday);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.dayOfWeek).toBe(0);
		}
	});

	it("should validate day of week 6 (Saturday)", () => {
		const dataWithSaturday = {
			...validData,
			dayOfWeek: 6,
		};

		const result = AvailableSlotResponseDTO.safeParse(dataWithSaturday);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.dayOfWeek).toBe(6);
		}
	});

	it("should validate hour 0 and 23", () => {
		const dataWithEdgeHours = {
			...validData,
			startHour: 0,
			endHour: 23,
		};

		const result = AvailableSlotResponseDTO.safeParse(dataWithEdgeHours);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.startHour).toBe(0);
			expect(result.data.endHour).toBe(23);
		}
	});

	it("should reject invalid availabilityId UUID", () => {
		const invalidData = {
			...validData,
			availabilityId: "invalid-uuid",
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid doctorId UUID", () => {
		const invalidData = {
			...validData,
			doctorId: "invalid-uuid",
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject dayOfWeek less than 0", () => {
		const invalidData = {
			...validData,
			dayOfWeek: -1,
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject dayOfWeek greater than 6", () => {
		const invalidData = {
			...validData,
			dayOfWeek: 7,
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject startHour less than 0", () => {
		const invalidData = {
			...validData,
			startHour: -1,
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject startHour greater than 23", () => {
		const invalidData = {
			...validData,
			startHour: 24,
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject endHour less than 0", () => {
		const invalidData = {
			...validData,
			endHour: -1,
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject endHour greater than 23", () => {
		const invalidData = {
			...validData,
			endHour: 24,
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid availableDate", () => {
		const invalidData = {
			...validData,
			availableDate: "invalid-date",
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject non-boolean isAvailable", () => {
		const invalidData = {
			...validData,
			isAvailable: "true",
		};

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing required fields", () => {
		const { availabilityId, ...invalidData } = validData;

		const result = AvailableSlotResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
