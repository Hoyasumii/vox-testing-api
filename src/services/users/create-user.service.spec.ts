import { CreateUserService } from "./create-user.service";
import { UsersRepository } from "t/repositories/users.repository";
import { CreateUserDTO } from "@/dtos/users";
import { MemoryCache } from "../../../test/cache/memory-cache";

describe("CreateUserService", () => {
	let service: CreateUserService;
	let repository: UsersRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new UsersRepository(cache);
		service = new CreateUserService(repository);
		
		// Configurar variável de ambiente para o hash
		process.env.ARGON_SECRET = "test-secret-key";
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("deve criar um usuário com sucesso", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};

			// Act
			const result = await service.run(userData);

			// Assert
			expect(typeof result).toBe("string");
			expect(result).toMatch(/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i);
			expect(repository.count()).toBe(1);
		});

		it("deve hash a senha antes de salvar", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};

			// Act
			const userId = await service.run(userData);
			const users = repository.findAll();

			// Assert
			expect(users[0].password).not.toBe("Password123!");
			expect(users[0].password).toContain("$argon2");
		});

		it("deve criar usuário com tipo PATIENT por padrão", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
			};

			// Act
			const userId = await service.run(userData);
			const user = await repository.getById(userId);

			// Assert
			expect(user?.type).toBe("PATIENT");
		});

		it("deve retornar erro para dados inválidos", async () => {
			// Arrange
			const invalidData = {
				name: "",
				email: "email-invalido",
				password: "123",
			} as CreateUserDTO;

			// Act & Assert
			await expect(service.run(invalidData)).rejects.toThrow();
		});

		it("deve criar múltiplos usuários com IDs únicos", async () => {
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

			// Act
			const userId1 = await service.run(userData1);
			const userId2 = await service.run(userData2);

			// Assert
			expect(userId1).not.toBe(userId2);
			expect(repository.count()).toBe(2);
		});

		it("deve criar usuário DOCTOR corretamente", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "Dr. Pedro",
				email: "pedro@example.com",
				password: "Password789#",
				type: "DOCTOR",
			};

			// Act
			const userId = await service.run(userData);
			const user = await repository.getById(userId);

			// Assert
			expect(user?.type).toBe("DOCTOR");
			expect(user?.name).toBe("Dr. Pedro");
			expect(user?.email).toBe("pedro@example.com");
		});
	});
});
