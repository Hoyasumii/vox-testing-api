import { GetUserContentByIdService } from "./get-user-content-by-id.service";
import { UsersRepository } from "t/repositories/users.repository";
import { CreateUserDTO } from "@/dtos/users";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";

describe("GetUserContentByIdService", () => {
	let service: GetUserContentByIdService;
	let repository: UsersRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new UsersRepository(cache, testChannel);
		service = new GetUserContentByIdService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("deve retornar usuário existente por ID", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			// Act
			const result = await service.run(userId);

			// Assert
			expect(result).toBeDefined();
			expect(result.id).toBe(userId);
			expect(result.name).toBe("João Silva");
			expect(result.email).toBe("joao@example.com");
			expect(result.type).toBe("PATIENT");
			expect(result.createdAt).toBeInstanceOf(Date);
			expect(result.updatedAt).toBeInstanceOf(Date);
		});

		it("não deve retornar a senha no resultado", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			// Act
			const result = await service.run(userId);

			// Assert
			expect(result).not.toHaveProperty("password");
		});

		it("deve retornar erro para ID inválido", async () => {
			// Arrange
			const invalidId = "id-invalido";

			// Act & Assert
			await expect(service.run(invalidId)).rejects.toThrow();
		});

		it("deve retornar erro para usuário não encontrado", async () => {
			// Arrange
			const nonExistentId = "550e8400-e29b-41d4-a716-446655440000";

			// Act & Assert
			await expect(service.run(nonExistentId)).rejects.toThrow();
		});

		it("deve retornar usuário DOCTOR corretamente", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "Dr. Maria",
				email: "maria@example.com",
				password: "Password456@",
				type: "DOCTOR",
			};
			const userId = await repository.create(userData);

			// Act
			const result = await service.run(userId);

			// Assert
			expect(result.type).toBe("DOCTOR");
			expect(result.name).toBe("Dr. Maria");
		});

		it("deve retornar dados com tipos corretos", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			// Act
			const result = await service.run(userId);

			// Assert
			expect(typeof result.id).toBe("string");
			expect(typeof result.name).toBe("string");
			expect(typeof result.email).toBe("string");
			expect(typeof result.type).toBe("string");
			expect(result.createdAt).toBeInstanceOf(Date);
			expect(result.updatedAt).toBeInstanceOf(Date);
		});
	});
});
