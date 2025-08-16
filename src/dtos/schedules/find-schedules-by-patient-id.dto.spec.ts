import { FindSchedulesByPatientIdDTO } from "./find-schedules-by-patient-id.dto";

describe("FindSchedulesByPatientIdDTO", () => {
	const validData = {
		patientId: "550e8400-e29b-41d4-a716-446655440000",
		page: 1,
		limit: 10,
	};

	it("should validate valid patient ID with pagination", () => {
		const result = FindSchedulesByPatientIdDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.patientId).toBe(validData.patientId);
			expect(result.data.page).toBe(validData.page);
			expect(result.data.limit).toBe(validData.limit);
		}
	});

	it("should use default values for page and limit", () => {
		const minimalData = {
			patientId: "550e8400-e29b-41d4-a716-446655440000",
		};

		const result = FindSchedulesByPatientIdDTO.safeParse(minimalData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.page).toBe(1);
			expect(result.data.limit).toBe(10);
		}
	});

	it("should reject invalid patient UUID", () => {
		const invalidData = {
			...validData,
			patientId: "invalid-uuid",
		};

		const result = FindSchedulesByPatientIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject negative page number", () => {
		const invalidData = {
			...validData,
			page: -1,
		};

		const result = FindSchedulesByPatientIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject zero page number", () => {
		const invalidData = {
			...validData,
			page: 0,
		};

		const result = FindSchedulesByPatientIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject negative limit", () => {
		const invalidData = {
			...validData,
			limit: -1,
		};

		const result = FindSchedulesByPatientIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject zero limit", () => {
		const invalidData = {
			...validData,
			limit: 0,
		};

		const result = FindSchedulesByPatientIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject limit over 100", () => {
		const invalidData = {
			...validData,
			limit: 101,
		};

		const result = FindSchedulesByPatientIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing patientId", () => {
		const { patientId, ...invalidData } = validData;

		const result = FindSchedulesByPatientIdDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
