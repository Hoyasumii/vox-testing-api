import { AuthenticateUserDTO } from "./authenticate-user.dto";

describe("AuthenticateUserDTO", () => {
	describe("validação de dados válidos", () => {
		it("deve validar email e senha válidos", () => {
			// Arrange
			const validData = {
				email: "usuario@email.com",
				password: "Password123!",
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(validData);

			// Assert
			expect(result.success).toBe(true);
			if (result.success) {
				expect(result.data.email).toBe("usuario@email.com");
				expect(result.data.password).toBe("Password123!");
			}
		});

		it("deve validar diferentes formatos de email válidos", () => {
			// Arrange
			const validEmails = [
				"test@example.com",
				"user.name@domain.co.uk",
				"123@test-domain.org",
				"email+tag@gmail.com",
				"user_name@domain.com",
			];

			validEmails.forEach(email => {
				const validData = {
					email,
					password: "Password123!",
				};

				// Act
				const result = AuthenticateUserDTO.safeParse(validData);

				// Assert
				expect(result.success).toBe(true);
			});
		});

		it("deve validar diferentes senhas válidas", () => {
			// Arrange
			const validPasswords = [
				"Password123!",
				"MySecret456@",
				"Strong789#",
				"Complex1$",
			];

			validPasswords.forEach(password => {
				const validData = {
					email: "usuario@email.com",
					password,
				};

				// Act
				const result = AuthenticateUserDTO.safeParse(validData);

				// Assert
				expect(result.success).toBe(true);
			});
		});
	});

	describe("validação de email inválido", () => {
		it("deve rejeitar email inválido", () => {
			// Arrange
			const invalidData = {
				email: "email-invalido",
				password: "Password123!",
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				expect(result.error.issues[0].message).toBe("Email deve ter um formato válido");
			}
		});

		it("deve rejeitar diferentes formatos de email inválidos", () => {
			// Arrange
			const invalidEmails = [
				"plainaddress",
				"@missingdomain.com",
				"missing@.com",
				"spaces in@email.com",
				"double@@domain.com",
				"",
			];

			invalidEmails.forEach(email => {
				const invalidData = {
					email,
					password: "Password123!",
				};

				// Act
				const result = AuthenticateUserDTO.safeParse(invalidData);

				// Assert
				expect(result.success).toBe(false);
			});
		});
	});

	describe("validação de senha inválida", () => {
		it("deve rejeitar senha sem letra maiúscula", () => {
			// Arrange
			const invalidData = {
				email: "usuario@email.com",
				password: "password123!",
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const passwordErrors = result.error.issues.filter(issue => 
					issue.path.includes("password")
				);
				expect(passwordErrors.some(error => 
					error.message.includes("letra maiúscula")
				)).toBe(true);
			}
		});

		it("deve rejeitar senha sem caractere especial", () => {
			// Arrange
			const invalidData = {
				email: "usuario@email.com",
				password: "Password123",
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const passwordErrors = result.error.issues.filter(issue => 
					issue.path.includes("password")
				);
				expect(passwordErrors.some(error => 
					error.message.includes("caractere especial")
				)).toBe(true);
			}
		});

		it("deve rejeitar senha muito curta", () => {
			// Arrange
			const invalidData = {
				email: "usuario@email.com",
				password: "Pass1!",
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const passwordErrors = result.error.issues.filter(issue => 
					issue.path.includes("password")
				);
				expect(passwordErrors.some(error => 
					error.message.includes("no mínimo 7 caracteres")
				)).toBe(true);
			}
		});

		it("deve rejeitar senha sem letra minúscula", () => {
			// Arrange
			const invalidData = {
				email: "usuario@email.com",
				password: "PASSWORD123!",
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
			if (!result.success) {
				const passwordErrors = result.error.issues.filter(issue => 
					issue.path.includes("password")
				);
				expect(passwordErrors.some(error => 
					error.message.includes("letra minúscula")
				)).toBe(true);
			}
		});
	});

	describe("validação de campos obrigatórios", () => {
		it("deve rejeitar objeto sem email", () => {
			// Arrange
			const invalidData = {
				password: "Password123!",
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("deve rejeitar objeto sem senha", () => {
			// Arrange
			const invalidData = {
				email: "usuario@email.com",
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("deve rejeitar objeto vazio", () => {
			// Arrange
			const invalidData = {};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("deve rejeitar valores null", () => {
			// Arrange
			const invalidData = {
				email: null,
				password: null,
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("deve rejeitar valores undefined", () => {
			// Arrange
			const invalidData = {
				email: undefined,
				password: undefined,
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});
	});

	describe("validação de tipo", () => {
		it("deve rejeitar tipos incorretos", () => {
			// Arrange
			const invalidData = {
				email: 123,
				password: true,
			};

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("deve rejeitar arrays", () => {
			// Arrange
			const invalidData = [
				"usuario@email.com",
				"Password123!",
			];

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});

		it("deve rejeitar strings simples", () => {
			// Arrange
			const invalidData = "usuario@email.com";

			// Act
			const result = AuthenticateUserDTO.safeParse(invalidData);

			// Assert
			expect(result.success).toBe(false);
		});
	});
});
