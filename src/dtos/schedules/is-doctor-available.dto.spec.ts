import { IsDoctorAvailableDTO } from "./is-doctor-available.dto";

describe("IsDoctorAvailableDTO", () => {
	const validData = {
		doctorId: "550e8400-e29b-41d4-a716-446655440000",
		targetDate: new Date("2025-08-17T10:00:00Z"),
	};

	it("should validate valid data", () => {
		const result = IsDoctorAvailableDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.doctorId).toBe(validData.doctorId);
			expect(result.data.targetDate).toEqual(validData.targetDate);
		}
	});

	it("should reject invalid doctor UUID", () => {
		const invalidData = {
			...validData,
			doctorId: "invalid-uuid",
		};

		const result = IsDoctorAvailableDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid targetDate", () => {
		const invalidData = {
			...validData,
			targetDate: "invalid-date",
		};

		const result = IsDoctorAvailableDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing doctorId", () => {
		const { doctorId, ...invalidData } = validData;

		const result = IsDoctorAvailableDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing targetDate", () => {
		const { targetDate, ...invalidData } = validData;

		const result = IsDoctorAvailableDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject null doctorId", () => {
		const invalidData = {
			...validData,
			doctorId: null,
		};

		const result = IsDoctorAvailableDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject null targetDate", () => {
		const invalidData = {
			...validData,
			targetDate: null,
		};

		const result = IsDoctorAvailableDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject undefined values", () => {
		const invalidData = {
			doctorId: undefined,
			targetDate: undefined,
		};

		const result = IsDoctorAvailableDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
