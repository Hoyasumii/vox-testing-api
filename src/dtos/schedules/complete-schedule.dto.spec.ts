import { CompleteScheduleDTO } from "./complete-schedule.dto";

describe("CompleteScheduleDTO", () => {
	const validData = {
		scheduleId: "550e8400-e29b-41d4-a716-446655440000",
	};

	it("should validate valid schedule ID", () => {
		const result = CompleteScheduleDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.scheduleId).toBe(validData.scheduleId);
		}
	});

	it("should reject invalid UUID", () => {
		const invalidData = {
			scheduleId: "invalid-uuid",
		};

		const result = CompleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject empty string", () => {
		const invalidData = {
			scheduleId: "",
		};

		const result = CompleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing scheduleId", () => {
		const result = CompleteScheduleDTO.safeParse({});
		expect(result.success).toBe(false);
	});

	it("should reject null scheduleId", () => {
		const invalidData = {
			scheduleId: null,
		};

		const result = CompleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject undefined scheduleId", () => {
		const invalidData = {
			scheduleId: undefined,
		};

		const result = CompleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject number as scheduleId", () => {
		const invalidData = {
			scheduleId: 123,
		};

		const result = CompleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
