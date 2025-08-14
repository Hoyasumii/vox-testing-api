import { GetUserByEmailDTO } from "./get-user-by-email.dto";

describe("GetUserByEmailDTO", () => {
	it("should validate valid email", () => {
		const validData = "usuario@email.com";

		const result = GetUserByEmailDTO.safeParse(validData);
		expect(result.success).toBe(true);
	});

	it("should reject invalid email", () => {
		const invalidData = "email-invalido";

		const result = GetUserByEmailDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
		if (!result.success) {
			expect(result.error.issues[0].message).toBe("Email deve ter um formato válido");
		}
	});

	it("should reject empty string", () => {
		const invalidData = "";

		const result = GetUserByEmailDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should reject missing email field", () => {
		const invalidData = "";

		const result = GetUserByEmailDTO.safeParse(invalidData);
		expect(result.success).toBe(false);
	});

	it("should validate different email formats", () => {
		const validEmails = [
			"test@example.com",
			"user.name@domain.co.uk",
			"123@test-domain.org",
			"email+tag@gmail.com",
		];

		validEmails.forEach(email => {
			const result = GetUserByEmailDTO.safeParse(email);
			expect(result.success).toBe(true);
		});
	});

	it("should reject invalid email formats", () => {
		const invalidEmails = [
			"plainaddress",
			"@missingdomain.com",
			"missing@.com",
			"spaces in@email.com",
			"double@@domain.com",
		];

		invalidEmails.forEach(email => {
			const result = GetUserByEmailDTO.safeParse(email);
			expect(result.success).toBe(false);
		});
	});
});
