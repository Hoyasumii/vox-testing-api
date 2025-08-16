import { CreateScheduleDTO } from "./create-schedule.dto";

describe("CreateScheduleDTO", () => {
	const validData = {
		availabilityId: "550e8400-e29b-41d4-a716-446655440000",
		patientId: "550e8400-e29b-41d4-a716-446655440001",
		doctorId: "550e8400-e29b-41d4-a716-446655440002",
		scheduledAt: new Date("2025-08-17T10:00:00Z"),
	};

	it("should validate valid schedule creation data", () => {
		const result = CreateScheduleDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.availabilityId).toBe(validData.availabilityId);
			expect(result.data.patientId).toBe(validData.patientId);
			expect(result.data.doctorId).toBe(validData.doctorId);
			expect(result.data.scheduledAt).toEqual(validData.scheduledAt);
		}
	});

	it("should reject invalid availabilityId UUID", () => {
		const invalidData = {
			...validData,
			availabilityId: "invalid-uuid",
		};

		const result = CreateScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid patientId UUID", () => {
		const invalidData = {
			...validData,
			patientId: "invalid-uuid",
		};

		const result = CreateScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid doctorId UUID", () => {
		const invalidData = {
			...validData,
			doctorId: "invalid-uuid",
		};

		const result = CreateScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid scheduledAt date", () => {
		const invalidData = {
			...validData,
			scheduledAt: "invalid-date",
		};

		const result = CreateScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing availabilityId", () => {
		const { availabilityId, ...invalidData } = validData;

		const result = CreateScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing patientId", () => {
		const { patientId, ...invalidData } = validData;

		const result = CreateScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing doctorId", () => {
		const { doctorId, ...invalidData } = validData;

		const result = CreateScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing scheduledAt", () => {
		const { scheduledAt, ...invalidData } = validData;

		const result = CreateScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
