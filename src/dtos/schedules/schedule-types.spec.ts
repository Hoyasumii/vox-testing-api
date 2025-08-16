import { ScheduleStatus } from "./schedule-types";

describe("ScheduleStatus", () => {
	it("should validate SCHEDULED status", () => {
		const result = ScheduleStatus.safeParse("SCHEDULED");
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toBe("SCHEDULED");
		}
	});

	it("should validate CANCELED status", () => {
		const result = ScheduleStatus.safeParse("CANCELED");
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toBe("CANCELED");
		}
	});

	it("should validate COMPLETED status", () => {
		const result = ScheduleStatus.safeParse("COMPLETED");
		expect(result.success).toBe(true);
		if (result.success) {
			expect(result.data).toBe("COMPLETED");
		}
	});

	it("should reject invalid status", () => {
		const result = ScheduleStatus.safeParse("INVALID_STATUS");
		expect(result.success).toBe(false);
	});

	it("should reject empty string", () => {
		const result = ScheduleStatus.safeParse("");
		expect(result.success).toBe(false);
	});

	it("should reject null", () => {
		const result = ScheduleStatus.safeParse(null);
		expect(result.success).toBe(false);
	});

	it("should reject undefined", () => {
		const result = ScheduleStatus.safeParse(undefined);
		expect(result.success).toBe(false);
	});
});
