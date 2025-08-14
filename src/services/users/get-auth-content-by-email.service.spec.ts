import { GetAuthContentByEmailService } from "./get-auth-content-by-email.service";
import { UsersRepository } from "t/repositories/users.repository";
import { CreateUserDTO, GetUserByEmailDTO } from "@/dtos/users";

describe("GetAuthContentByEmailService", () => {
	let service: GetAuthContentByEmailService;
	let repository: UsersRepository;

	beforeEach(() => {
		repository = new UsersRepository();
		service = new GetAuthContentByEmailService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("deve retornar dados de autenticação para email existente", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			await repository.create(userData);

			const email: GetUserByEmailDTO = "joao@example.com";

			// Act
			const result = await service.run(email);

			// Assert
			expect(result).toBeDefined();
			expect(result.id).toBeDefined();
			expect(result.password).toBe("Password123!");
			expect(typeof result.id).toBe("string");
			expect(typeof result.password).toBe("string");
		});

		it("deve retornar apenas id e password", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "DOCTOR",
			};
			await repository.create(userData);

			const email: GetUserByEmailDTO = "joao@example.com";

			// Act
			const result = await service.run(email);

			// Assert
			expect(Object.keys(result)).toEqual(["id", "password"]);
			expect(result).not.toHaveProperty("name");
			expect(result).not.toHaveProperty("email");
			expect(result).not.toHaveProperty("type");
			expect(result).not.toHaveProperty("createdAt");
			expect(result).not.toHaveProperty("updatedAt");
		});

		it("deve retornar erro para email inválido", async () => {
			// Arrange
			const invalidEmail = "email-invalido";

			// Act & Assert
			await expect(service.run(invalidEmail)).rejects.toThrow();
		});

		it("deve retornar erro para email não encontrado", async () => {
			// Arrange
			const nonExistentEmail: GetUserByEmailDTO = "inexistente@example.com";

			// Act & Assert
			await expect(service.run(nonExistentEmail)).rejects.toThrow();
		});

		it("deve funcionar com usuário DOCTOR", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "Dr. Maria",
				email: "maria.doctor@clinic.com",
				password: "Password456@",
				type: "DOCTOR",
			};
			await repository.create(userData);

			const email: GetUserByEmailDTO = "maria.doctor@clinic.com";

			// Act
			const result = await service.run(email);

			// Assert
			expect(result).toBeDefined();
			expect(result.password).toBe("Password456@");
		});

		it("deve funcionar com usuário PATIENT", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "Ana Silva",
				email: "ana.patient@example.com",
				password: "Password789#",
				type: "PATIENT",
			};
			await repository.create(userData);

			const email: GetUserByEmailDTO = "ana.patient@example.com";

			// Act
			const result = await service.run(email);

			// Assert
			expect(result).toBeDefined();
			expect(result.password).toBe("Password789#");
		});

		it("deve buscar email com case sensitivity", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			await repository.create(userData);

			const emailUpperCase: GetUserByEmailDTO = "JOAO@EXAMPLE.COM";

			// Act & Assert
			await expect(service.run(emailUpperCase)).rejects.toThrow();
		});

		it("deve retornar diferentes IDs para diferentes usuários", async () => {
			// Arrange
			const userData1: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};

			const userData2: CreateUserDTO = {
				name: "Maria Santos",
				email: "maria@example.com",
				password: "Password456@",
				type: "DOCTOR",
			};

			await repository.create(userData1);
			await repository.create(userData2);

			// Act
			const result1 = await service.run("joao@example.com");
			const result2 = await service.run("maria@example.com");

			// Assert
			expect(result1.id).not.toBe(result2.id);
			expect(result1.password).toBe("Password123!");
			expect(result2.password).toBe("Password456@");
		});
	});
});
