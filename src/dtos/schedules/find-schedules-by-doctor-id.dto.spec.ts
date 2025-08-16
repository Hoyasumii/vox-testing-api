import { FindSchedulesByDoctorIdDTO } from "./find-schedules-by-doctor-id.dto";

describe("FindSchedulesByDoctorIdDTO", () => {
	const validData = {
		doctorId: "550e8400-e29b-41d4-a716-446655440000",
		page: 1,
		limit: 10,
		startDate: new Date("2025-08-16T00:00:00Z"),
		endDate: new Date("2025-08-20T23:59:59Z"),
	};

	it("should validate valid doctor ID with all parameters", () => {
		const result = FindSchedulesByDoctorIdDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.doctorId).toBe(validData.doctorId);
			expect(result.data.page).toBe(validData.page);
			expect(result.data.limit).toBe(validData.limit);
			expect(result.data.startDate).toEqual(validData.startDate);
			expect(result.data.endDate).toEqual(validData.endDate);
		}
	});

	it("should use default values for optional parameters", () => {
		const minimalData = {
			doctorId: "550e8400-e29b-41d4-a716-446655440000",
		};

		const result = FindSchedulesByDoctorIdDTO.safeParse(minimalData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
			expect(result.data.startDate).toBeUndefined();
			expect(result.data.endDate).toBeUndefined();
		}
	});

	it("should validate with only startDate", () => {
		const dataWithStartDate = {
			doctorId: "550e8400-e29b-41d4-a716-446655440000",
			startDate: new Date("2025-08-16T00:00:00Z"),
		};

		const result = FindSchedulesByDoctorIdDTO.safeParse(dataWithStartDate);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.startDate).toEqual(dataWithStartDate.startDate);
			expect(result.data.endDate).toBeUndefined();
		}
	});

	it("should validate with only endDate", () => {
		const dataWithEndDate = {
			doctorId: "550e8400-e29b-41d4-a716-446655440000",
			endDate: new Date("2025-08-20T23:59:59Z"),
		};

		const result = FindSchedulesByDoctorIdDTO.safeParse(dataWithEndDate);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.startDate).toBeUndefined();
			expect(result.data.endDate).toEqual(dataWithEndDate.endDate);
		}
	});

	it("should reject invalid doctor UUID", () => {
		const invalidData = {
			...validData,
			doctorId: "invalid-uuid",
		};

		const result = FindSchedulesByDoctorIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject negative page number", () => {
		const invalidData = {
			...validData,
			page: -1,
		};

		const result = FindSchedulesByDoctorIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject limit over 100", () => {
		const invalidData = {
			...validData,
			limit: 101,
		};

		const result = FindSchedulesByDoctorIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid startDate", () => {
		const invalidData = {
			...validData,
			startDate: "invalid-date",
		};

		const result = FindSchedulesByDoctorIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid endDate", () => {
		const invalidData = {
			...validData,
			endDate: "invalid-date",
		};

		const result = FindSchedulesByDoctorIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing doctorId", () => {
		const { doctorId, ...invalidData } = validData;

		const result = FindSchedulesByDoctorIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
