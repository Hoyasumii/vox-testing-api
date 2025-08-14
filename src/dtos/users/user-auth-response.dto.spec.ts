import { UserAuthResponseDTO } from "./user-auth-response.dto";

describe("UserAuthResponseDTO", () => {
	it("should validate a valid user auth response", () => {
		const validData = {
			id: "123e4567-e89b-12d3-a456-426614174000",
			password: "Password-123",
		};

		const result = UserAuthResponseDTO.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject invalid UUID", () => {
		const invalidData = {
			id: "invalid-uuid",
			password: "Password-123",
		};

		const result = UserAuthResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing password", () => {
		const invalidData = {
			id: "123e4567-e89b-12d3-a456-426614174000",
			// password ausente
		};

		const result = UserAuthResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing id", () => {
		const invalidData = {
			// id ausente
			password: "Password-123",
		};

		const result = UserAuthResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject empty password", () => {
		const invalidData = {
			id: "123e4567-e89b-12d3-a456-426614174000",
			password: "",
		};

		const result = UserAuthResponseDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should accept different UUID formats", () => {
		const validUUIDs = [
			"123e4567-e89b-12d3-a456-426614174000",
			"550e8400-e29b-41d4-a716-446655440000",
			"6ba7b810-9dad-11d1-80b4-00c04fd430c8",
		];

		validUUIDs.forEach(uuid => {
			const result = UserAuthResponseDTO.safeParse({
				id: uuid,
				password: "Password-123",
			});
			expect(result.success).toBe(true);
		});
	});

	it("should not accept additional fields", () => {
		const dataWithExtraFields = {
			id: "123e4567-e89b-12d3-a456-426614174000",
			password: "Password-123",
			email: "test@email.com", // Campo extra
			name: "João Silva", // Campo extra
		};

		const result = UserAuthResponseDTO.safeParse(dataWithExtraFields);
		// Zod por padrão ignora campos extras, então será true
		expect(result.success).toBe(true);
		
		// Mas os dados parseados devem conter apenas id e password
		if (result.success) {
			expect(Object.keys(result.data)).toEqual(["id", "password"]);
		}
	});
});
