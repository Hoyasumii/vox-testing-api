import { AuthenticateUserService } from "./authenticate-user.service";
import { UsersRepository } from "t/repositories/users.repository";
import { CreateUserDTO, AuthenticateUserDTO } from "@/dtos/users";
import { PasswordHasher } from "@/utils";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";

describe("AuthenticateUserService", () => {
	let service: AuthenticateUserService;
	let repository: UsersRepository;
	let hasher: PasswordHasher;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new UsersRepository(cache, testChannel);
		service = new AuthenticateUserService(repository);
		hasher = new PasswordHasher(process.env.ARGON_SECRET || "test-secret");
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("deve retornar um token JWT válido para credenciais corretas", async () => {
			// Arrange
			const password = "Password-123";
			const hashedPassword = await hasher.hash(password);
			
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: hashedPassword,
				type: "PATIENT",
			};
			await repository.create(userData);

			const authData: AuthenticateUserDTO = {
				email: "joao@example.com",
				password: password,
			};

			// Act
			const result = await service.run(authData);

			// Assert
			expect(result).toBeDefined();
			expect(typeof result).toBe("string");
			expect(result.length).toBeGreaterThan(0);
		});

		it("deve retornar token para usuário DOCTOR", async () => {
			// Arrange
			const password = "Password456@";
			const hashedPassword = await hasher.hash(password);
			
			const userData: CreateUserDTO = {
				name: "Dr. Maria",
				email: "maria.doctor@clinic.com",
				password: hashedPassword,
				type: "DOCTOR",
			};
			await repository.create(userData);

			const authData: AuthenticateUserDTO = {
				email: "maria.doctor@clinic.com",
				password: password,
			};

			// Act
			const result = await service.run(authData);

			// Assert
			expect(result).toBeDefined();
			expect(typeof result).toBe("string");
		});

		it("deve retornar token para usuário PATIENT", async () => {
			// Arrange
			const password = "Password789#";
			const hashedPassword = await hasher.hash(password);
			
			const userData: CreateUserDTO = {
				name: "Ana Silva",
				email: "ana.patient@example.com",
				password: hashedPassword,
				type: "PATIENT",
			};
			await repository.create(userData);

			const authData: AuthenticateUserDTO = {
				email: "ana.patient@example.com",
				password: password,
			};

			// Act
			const result = await service.run(authData);

			// Assert
			expect(result).toBeDefined();
			expect(typeof result).toBe("string");
		});

		it("deve rejeitar para email inválido", async () => {
			// Arrange
			const authData = {
				email: "email-invalido",
				password: "Password123!",
			};

			// Act & Assert
			await expect(service.run(authData)).rejects.toThrow();
		});

		it("deve rejeitar para email não encontrado", async () => {
			// Arrange
			const authData: AuthenticateUserDTO = {
				email: "inexistente@example.com",
				password: "Password123!",
			};

			// Act & Assert
			await expect(service.run(authData)).rejects.toThrow();
		});

		it("deve rejeitar para senha incorreta", async () => {
			// Arrange
			const password = "Password123!";
			const hashedPassword = await hasher.hash(password);
			
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: hashedPassword,
				type: "PATIENT",
			};
			await repository.create(userData);

			const authData: AuthenticateUserDTO = {
				email: "joao@example.com",
				password: "SenhaErrada123!",
			};

			// Act & Assert
			await expect(service.run(authData)).rejects.toThrow();
		});

		it("deve ser case sensitive para email", async () => {
			// Arrange
			const password = "Password123!";
			const hashedPassword = await hasher.hash(password);
			
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: hashedPassword,
				type: "PATIENT",
			};
			await repository.create(userData);

			const authData: AuthenticateUserDTO = {
				email: "JOAO@EXAMPLE.COM",
				password: password,
			};

			// Act & Assert
			await expect(service.run(authData)).rejects.toThrow();
		});

		it("deve retornar tokens diferentes para diferentes usuários", async () => {
			// Arrange
			const password1 = "Password123!";
			const password2 = "Password456@";
			const hashedPassword1 = await hasher.hash(password1);
			const hashedPassword2 = await hasher.hash(password2);
			
			const userData1: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: hashedPassword1,
				type: "PATIENT",
			};

			const userData2: CreateUserDTO = {
				name: "Maria Santos",
				email: "maria@example.com",
				password: hashedPassword2,
				type: "DOCTOR",
			};

			await repository.create(userData1);
			await repository.create(userData2);

			const authData1: AuthenticateUserDTO = {
				email: "joao@example.com",
				password: password1,
			};

			const authData2: AuthenticateUserDTO = {
				email: "maria@example.com",
				password: password2,
			};

			// Act
			const result1 = await service.run(authData1);
			const result2 = await service.run(authData2);

			// Assert
			expect(result1).not.toBe(result2);
			expect(typeof result1).toBe("string");
			expect(typeof result2).toBe("string");
		});
	});
});
