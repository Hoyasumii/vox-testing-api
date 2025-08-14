import { UpdateUserService } from "./update-user.service";
import { UsersRepository } from "t/repositories/users.repository";
import { CreateUserDTO, UpdateUserDTO } from "@/dtos/users";

describe("UpdateUserService", () => {
	let service: UpdateUserService;
	let repository: UsersRepository;

	beforeEach(() => {
		repository = new UsersRepository();
		service = new UpdateUserService(repository);
	});

	afterEach(() => {
		repository.clear();
	});

	describe("run", () => {
		it("deve atualizar usuário existente com sucesso", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const updateData: UpdateUserDTO = {
				name: "João Santos",
				email: "joao.santos@example.com",
				type: "DOCTOR",
			};

			// Act
			const result = await service.run({ id: userId, data: updateData });

			// Assert
			expect(result).toBe(true);
			
			const updatedUser = await repository.getById(userId);
			expect(updatedUser?.name).toBe("João Santos");
			expect(updatedUser?.email).toBe("joao.santos@example.com");
			expect(updatedUser?.type).toBe("DOCTOR");
		});

		it("deve atualizar apenas os campos fornecidos", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const updateData: UpdateUserDTO = {
				name: "João Santos",
			};

			// Act
			const result = await service.run({ id: userId, data: updateData });

			// Assert
			expect(result).toBe(true);
			
			const updatedUser = await repository.getById(userId);
			expect(updatedUser?.name).toBe("João Santos");
			expect(updatedUser?.email).toBe("joao@example.com"); // Não mudou
			expect(updatedUser?.type).toBe("PATIENT"); // Não mudou
		});

		it("deve retornar erro para ID inválido", async () => {
			// Arrange
			const invalidId = "id-invalido";
			const updateData: UpdateUserDTO = {
				name: "João Santos",
			};

			// Act & Assert
			await expect(service.run({ id: invalidId, data: updateData })).rejects.toThrow();
		});

		it("deve retornar erro para dados de atualização inválidos", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const invalidUpdateData = {
				name: "",
				email: "email-invalido",
			} as UpdateUserDTO;

			// Act & Assert
			await expect(service.run({ id: userId, data: invalidUpdateData })).rejects.toThrow();
		});

		it("deve retornar false para usuário inexistente", async () => {
			// Arrange
			const nonExistentId = "550e8400-e29b-41d4-a716-446655440000";
			const updateData: UpdateUserDTO = {
				name: "João Santos",
			};

			// Act
			const result = await service.run({ id: nonExistentId, data: updateData });

			// Assert
			expect(result).toBe(false);
		});

		it("deve atualizar email corretamente", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const updateData: UpdateUserDTO = {
				email: "novo.email@example.com",
			};

			// Act
			const result = await service.run({ id: userId, data: updateData });

			// Assert
			expect(result).toBe(true);
			
			const updatedUser = await repository.getById(userId);
			expect(updatedUser?.email).toBe("novo.email@example.com");
		});

		it("deve atualizar tipo de usuário corretamente", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const updateData: UpdateUserDTO = {
				type: "DOCTOR",
			};

			// Act
			const result = await service.run({ id: userId, data: updateData });

			// Assert
			expect(result).toBe(true);
			
			const updatedUser = await repository.getById(userId);
			expect(updatedUser?.type).toBe("DOCTOR");
		});

		it("deve atualizar múltiplos campos simultaneamente", async () => {
			// Arrange
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const updateData: UpdateUserDTO = {
				name: "Dr. João Santos",
				email: "dr.joao@clinic.com",
				type: "DOCTOR",
			};

			// Act
			const result = await service.run({ id: userId, data: updateData });

			// Assert
			expect(result).toBe(true);
			
			const updatedUser = await repository.getById(userId);
			expect(updatedUser?.name).toBe("Dr. João Santos");
			expect(updatedUser?.email).toBe("dr.joao@clinic.com");
			expect(updatedUser?.type).toBe("DOCTOR");
		});
	});
});
