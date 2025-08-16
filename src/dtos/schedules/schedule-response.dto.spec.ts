import { ScheduleResponseDTO } from "./schedule-response.dto";

describe("ScheduleResponseDTO", () => {
	const validData = {
		id: "550e8400-e29b-41d4-a716-446655440000",
		status: "SCHEDULED" as const,
		availabilityId: "550e8400-e29b-41d4-a716-446655440001",
		patientId: "550e8400-e29b-41d4-a716-446655440002",
		doctorId: "550e8400-e29b-41d4-a716-446655440003",
		scheduledAt: new Date("2025-08-17T10:00:00Z"),
		createdAt: new Date("2025-08-16T12:00:00Z"),
		updatedAt: new Date("2025-08-16T12:00:00Z"),
	};

	it("should validate valid schedule response data", () => {
		const result = ScheduleResponseDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.id).toBe(validData.id);
			expect(result.data.status).toBe(validData.status);
			expect(result.data.availabilityId).toBe(validData.availabilityId);
			expect(result.data.patientId).toBe(validData.patientId);
			expect(result.data.doctorId).toBe(validData.doctorId);
			expect(result.data.scheduledAt).toEqual(validData.scheduledAt);
			expect(result.data.createdAt).toEqual(validData.createdAt);
			expect(result.data.updatedAt).toEqual(validData.updatedAt);
		}
	});

	it("should validate without optional dates", () => {
		const { createdAt, updatedAt, ...minimalData } = validData;

		const result = ScheduleResponseDTO.safeParse(minimalData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.createdAt).toBeUndefined();
			expect(result.data.updatedAt).toBeUndefined();
		}
	});

	it("should validate CANCELED status", () => {
		const dataWithCanceledStatus = {
			...validData,
			status: "CANCELED" as const,
		};

		const result = ScheduleResponseDTO.safeParse(dataWithCanceledStatus);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.status).toBe("CANCELED");
		}
	});

	it("should validate COMPLETED status", () => {
		const dataWithCompletedStatus = {
			...validData,
			status: "COMPLETED" as const,
		};

		const result = ScheduleResponseDTO.safeParse(dataWithCompletedStatus);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.status).toBe("COMPLETED");
		}
	});

	it("should reject invalid UUID for id", () => {
		const invalidData = {
			...validData,
			id: "invalid-uuid",
		};

		const result = ScheduleResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid status", () => {
		const invalidData = {
			...validData,
			status: "INVALID_STATUS",
		};

		const result = ScheduleResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid availabilityId UUID", () => {
		const invalidData = {
			...validData,
			availabilityId: "invalid-uuid",
		};

		const result = ScheduleResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid patientId UUID", () => {
		const invalidData = {
			...validData,
			patientId: "invalid-uuid",
		};

		const result = ScheduleResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid doctorId UUID", () => {
		const invalidData = {
			...validData,
			doctorId: "invalid-uuid",
		};

		const result = ScheduleResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid scheduledAt date", () => {
		const invalidData = {
			...validData,
			scheduledAt: "invalid-date",
		};

		const result = ScheduleResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing required fields", () => {
		const { id, ...invalidData } = validData;

		const result = ScheduleResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
