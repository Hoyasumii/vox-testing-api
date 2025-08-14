import { GetUserByIdDto } from "./get-user-by-id.dto";

describe("GetUserByIdDto", () => {
	it("should validate valid UUID", () => {
		const validData = {
			id: "123e4567-e89b-12d3-a456-426614174000",
		};

		const result = GetUserByIdDto.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject invalid UUID", () => {
		const invalidData = {
			id: "invalid-uuid",
		};

		const result = GetUserByIdDto.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("ID deve ser um UUID válido");
		}
	});

	it("should reject empty string", () => {
		const invalidData = {
			id: "",
		};

		const result = GetUserByIdDto.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing id field", () => {
		const invalidData = {};

		const result = GetUserByIdDto.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should accept different valid UUID formats", () => {
		const validUUIDs = [
			"123e4567-e89b-12d3-a456-426614174000",
			"550e8400-e29b-41d4-a716-446655440000",
			"6ba7b810-9dad-11d1-80b4-00c04fd430c8",
		];

		validUUIDs.forEach(uuid => {
			const result = GetUserByIdDto.safeParse({ id: uuid });
			expect(result.success).toBe(true);
		});
	});
});
