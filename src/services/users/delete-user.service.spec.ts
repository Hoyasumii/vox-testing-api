import { DeleteUserService } from "./delete-user.service";
import { UsersRepository } from "t/repositories/users.repository";
import { CreateUserDTO } from "@/dtos/users";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";

describe("DeleteUserService", () => {
	let service: DeleteUserService;
	let repository: UsersRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new UsersRepository(cache, testChannel);
		service = new DeleteUserService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("deve deletar usuário existente com sucesso", async () => {
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
			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
			
			const deletedUser = await repository.getById(userId);
			expect(deletedUser).toBeNull();
		});

		it("deve retornar false para usuário inexistente", async () => {
			// Arrange
			const nonExistentId = "550e8400-e29b-41d4-a716-446655440000";

			// Act
			const result = await service.run(nonExistentId);

			// Assert
			expect(result).toBe(false);
		});

		it("deve retornar erro para ID inválido", async () => {
			// Arrange
			const invalidId = "id-invalido";

			// Act & Assert
			await expect(service.run(invalidId)).rejects.toThrow();
		});

		it("deve deletar apenas o usuário especificado", async () => {
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

			const userId1 = await repository.create(userData1);
			const userId2 = await repository.create(userData2);

			// Act
			const result = await service.run(userId1);

			// Assert
			expect(result).toBe(true);
			expect(repository.count()).toBe(1);
			
			const deletedUser = await repository.getById(userId1);
			const remainingUser = await repository.getById(userId2);
			
			expect(deletedUser).toBeNull();
			expect(remainingUser).toBeDefined();
			expect(remainingUser?.name).toBe("Maria Santos");
		});

		it("deve deletar usuário DOCTOR corretamente", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "Dr. Pedro",
				email: "pedro@example.com",
				password: "Password789#",
				type: "DOCTOR",
			};
			const userId = await repository.create(userData);

			// Act
			const result = await service.run(userId);

			// Assert
			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
		});

		it("deve deletar usuário PATIENT corretamente", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "Ana Silva",
				email: "ana@example.com",
				password: "Password321!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			// Act
			const result = await service.run(userId);

			// Assert
			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
		});

		it("deve retornar boolean", async () => {
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
			expect(typeof result).toBe("boolean");
		});
	});
});
