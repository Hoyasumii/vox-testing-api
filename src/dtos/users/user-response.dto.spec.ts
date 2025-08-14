import { UserResponseDto } from "./user-response.dto";

describe("UserResponseDto", () => {
	it("should validate a valid user response", () => {
		const validData = {
			id: "123e4567-e89b-12d3-a456-426614174000",
			name: "João Silva",
			email: "joao@email.com",
			type: "DOCTOR" as const,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = UserResponseDto.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject invalid UUID", () => {
		const invalidData = {
			id: "invalid-uuid",
			name: "João Silva",
			email: "joao@email.com",
			type: "DOCTOR" as const,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = UserResponseDto.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid email", () => {
		const invalidData = {
			id: "123e4567-e89b-12d3-a456-426614174000",
			name: "João Silva",
			email: "email-invalido",
			type: "DOCTOR" as const,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = UserResponseDto.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject invalid user type", () => {
		const invalidData = {
			id: "123e4567-e89b-12d3-a456-426614174000",
			name: "João Silva",
			email: "joao@email.com",
			type: "INVALID_TYPE",
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = UserResponseDto.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing required fields", () => {
		const invalidData = {
			id: "123e4567-e89b-12d3-a456-426614174000",
			name: "João Silva",
			// email ausente
			type: "DOCTOR" as const,
			createdAt: new Date(),
			updatedAt: new Date(),
		};

		const result = UserResponseDto.safeParse(invalidData);
		expect(result.success).toBe(false);
	});
});
