import { CreateUserDTO } from "./create-user.dto";
import { UserType } from "./user-types";

describe("CreateUserDTO", () => {
	it("should validate a valid user creation data", () => {
		const validData = {
			name: "João Silva",
			email: "joao@email.com",
			password: "Password-123",
			type: "DOCTOR" as UserType,
		};

		const result = CreateUserDTO.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject invalid email", () => {
		const invalidData = {
			name: "João Silva",
			email: "email-invalido",
			password: "Password-123",
			type: "DOCTOR" as UserType,
		};

		const result = CreateUserDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Email deve ter um formato válido");
		}
	});

	it("should reject short password", () => {
		const invalidData = {
			name: "João Silva",
			email: "joao@email.com",
			password: "123",
			type: "DOCTOR" as UserType,
		};

		const result = CreateUserDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("A senha deve ter no mínimo 7 caracteres.");
		}
	});

	it("should reject invalid user type", () => {
		const invalidData = {
			name: "João Silva",
			email: "joao@email.com",
			password: "Password-123",
			type: "INVALID_TYPE",
		};

		const result = CreateUserDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject empty name", () => {
		const invalidData = {
			name: "",
			email: "joao@email.com",
			password: "Password-123",
			type: "DOCTOR" as UserType,
		};

		const result = CreateUserDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Nome é obrigatório");
		}
	});
});
