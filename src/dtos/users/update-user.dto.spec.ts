import { UpdateUserDto } from "./update-user.dto";

describe("UpdateUserDto", () => {
	it("should validate partial update data", () => {
		const validData = {
			name: "João Santos",
		};

		const result = UpdateUserDto.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should validate empty object", () => {
		const validData = {};

		const result = UpdateUserDto.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject invalid email in update", () => {
		const invalidData = {
			email: "email-invalido",
		};

		const result = UpdateUserDto.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Email deve ter um formato válido");
		}
	});

	it("should validate all fields together", () => {
		const validData = {
			name: "Maria Santos",
			email: "maria@email.com",
			type: "PATIENT" as const,
		};

		const result = UpdateUserDto.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject empty name", () => {
		const invalidData = {
			name: "",
		};

		const result = UpdateUserDto.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Nome é obrigatório");
		}
	});
});
