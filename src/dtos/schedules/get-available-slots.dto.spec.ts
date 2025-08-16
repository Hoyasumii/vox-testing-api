import { GetAvailableSlotsDTO } from "./get-available-slots.dto";

describe("GetAvailableSlotsDTO", () => {
	const validData = {
		doctorId: "550e8400-e29b-41d4-a716-446655440000",
		startDate: new Date("2025-08-16T00:00:00Z"),
		endDate: new Date("2025-08-20T23:59:59Z"),
	};

	it("should validate valid data", () => {
		const result = GetAvailableSlotsDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.doctorId).toBe(validData.doctorId);
			expect(result.data.startDate).toEqual(validData.startDate);
			expect(result.data.endDate).toEqual(validData.endDate);
		}
	});

	it("should reject invalid doctor UUID", () => {
		const invalidData = {
			...validData,
			doctorId: "invalid-uuid",
		};

		const result = GetAvailableSlotsDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid startDate", () => {
		const invalidData = {
			...validData,
			startDate: "invalid-date",
		};

		const result = GetAvailableSlotsDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid endDate", () => {
		const invalidData = {
			...validData,
			endDate: "invalid-date",
		};

		const result = GetAvailableSlotsDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing doctorId", () => {
		const { doctorId, ...invalidData } = validData;

		const result = GetAvailableSlotsDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing startDate", () => {
		const { startDate, ...invalidData } = validData;

		const result = GetAvailableSlotsDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing endDate", () => {
		const { endDate, ...invalidData } = validData;

		const result = GetAvailableSlotsDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject null values", () => {
		const invalidData = {
			doctorId: null,
			startDate: null,
			endDate: null,
		};

		const result = GetAvailableSlotsDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
