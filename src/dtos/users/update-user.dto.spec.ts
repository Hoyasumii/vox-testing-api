import { UpdateUserDTO } from "./update-user.dto";

describe("UpdateUserDTO", () => {
	it("should validate partial update data", () => {
		const validData = {
			name: "João Santos",
		};

		const result = UpdateUserDTO.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should validate empty object", () => {
		const validData = {};

		const result = UpdateUserDTO.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject invalid email in update", () => {
		const invalidData = {
			email: "email-invalido",
		};

		const result = UpdateUserDTO.safeParse(invalidData);
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

		const result = UpdateUserDTO.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject empty name", () => {
		const invalidData = {
			name: "",
		};

		const result = UpdateUserDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Nome é obrigatório");
		}
	});
});
