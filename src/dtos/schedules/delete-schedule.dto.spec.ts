import { DeleteScheduleDTO } from "./delete-schedule.dto";

describe("DeleteScheduleDTO", () => {
	const validData = {
		scheduleId: "550e8400-e29b-41d4-a716-446655440000",
	};

	it("should validate valid schedule ID", () => {
		const result = DeleteScheduleDTO.safeParse(validData);
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data.scheduleId).toBe(validData.scheduleId);
		}
	});

	it("should reject invalid UUID", () => {
		const invalidData = {
			scheduleId: "invalid-uuid",
		};

		const result = DeleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject empty string", () => {
		const invalidData = {
			scheduleId: "",
		};

		const result = DeleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing scheduleId", () => {
		const result = DeleteScheduleDTO.safeParse({});
		expect(result.success).toBe(false);
	});

	it("should reject null scheduleId", () => {
		const invalidData = {
			scheduleId: null,
		};

		const result = DeleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject undefined scheduleId", () => {
		const invalidData = {
			scheduleId: undefined,
		};

		const result = DeleteScheduleDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
