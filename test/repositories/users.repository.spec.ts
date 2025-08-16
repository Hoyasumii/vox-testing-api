import { UsersRepository } from "./users.repository";
import { 
	CreateUserDTO, 
	UpdateUserDTO, 
} from "@/dtos/users";
import { email } from '@/dtos';
import { MemoryCache } from "../cache/memory-cache";
import { testChannel } from "t/channels";

describe("InMemoryUsersRepository", () => {
	let repository: UsersRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new UsersRepository(cache, testChannel);
	});

	describe("create", () => {
		it("deve criar um usuário com sucesso", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};

			const userId = await repository.create(userData);

			expect(userId).toBeDefined();
			expect(typeof userId).toBe("string");
			expect(repository.count()).toBe(1);
		});

		it("deve criar múltiplos usuários com IDs únicos", async () => {
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

			expect(userId1).not.toBe(userId2);
			expect(repository.count()).toBe(2);
		});

		it("deve usar tipo PATIENT por padrão quando não especificado", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
			};

			const userId = await repository.create(userData);
			const user = await repository.getById(userId);

			expect(user?.type).toBe("PATIENT");
		});
	});

	describe("update", () => {
		it("deve atualizar um usuário existente", async () => {
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

			const result = await repository.update(userId, updateData);
			const updatedUser = await repository.getById(userId);

			expect(result).toBe(true);
			expect(updatedUser?.name).toBe("João Santos");
			expect(updatedUser?.email).toBe("joao.santos@example.com");
			expect(updatedUser?.type).toBe("DOCTOR");
		});

		it("deve retornar false ao tentar atualizar usuário inexistente", async () => {
			const updateData: UpdateUserDTO = {
				name: "João Santos",
			};

			const result = await repository.update("id-inexistente", updateData);

			expect(result).toBe(false);
		});

		it("deve atualizar apenas os campos fornecidos", async () => {
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

			const result = await repository.update(userId, updateData);
			const updatedUser = await repository.getById(userId);

			expect(result).toBe(true);
			expect(updatedUser?.name).toBe("João Santos");
			expect(updatedUser?.email).toBe("joao@example.com");
			expect(updatedUser?.type).toBe("PATIENT");
		});
	});

	describe("delete", () => {
		it("deve deletar um usuário existente", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const result = await repository.delete(userId);
			const deletedUser = await repository.getById(userId);

			expect(result).toBe(true);
			expect(deletedUser).toBeNull();
			expect(repository.count()).toBe(0);
		});

		it("deve retornar false ao tentar deletar usuário inexistente", async () => {
			const result = await repository.delete("id-inexistente");

			expect(result).toBe(false);
		});
	});

	describe("getById", () => {
		it("deve retornar um usuário existente", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const user = await repository.getById(userId);

			expect(user).toBeDefined();
			expect(user?.id).toBe(userId);
			expect(user?.name).toBe("João Silva");
			expect(user?.email).toBe("joao@example.com");
			expect(user?.type).toBe("PATIENT");
			expect(user?.createdAt).toBeInstanceOf(Date);
			expect(user?.updatedAt).toBeInstanceOf(Date);
		});

		it("deve retornar null para usuário inexistente", async () => {
			const user = await repository.getById("id-inexistente");

			expect(user).toBeNull();
		});

		it("não deve retornar a senha no UserResponseDTO", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			const userId = await repository.create(userData);

			const user = await repository.getById(userId);

			expect(user).toBeDefined();
			expect(user).not.toHaveProperty("password");
		});
	});

	describe("getByEmail", () => {
		it("deve retornar dados de autenticação para email existente", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			await repository.create(userData);

			const emailDTO: email = "joao@example.com";

			const authData = await repository.getByEmail(emailDTO);

			expect(authData).toBeDefined();
			expect(authData?.id).toBeDefined();
			expect(authData?.password).toBe("Password123!");
		});

		it("deve retornar null para email inexistente", async () => {
			const emailDTO: email = "inexistente@example.com";

			const authData = await repository.getByEmail(emailDTO);

			expect(authData).toBeNull();
		});

		it("deve retornar apenas id e password no UserAuthResponseDTO", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "DOCTOR",
			};
			await repository.create(userData);

			const emailDTO: email = "joao@example.com";

			const authData = await repository.getByEmail(emailDTO);

			expect(authData).toBeDefined();
			expect(Object.keys(authData!)).toEqual(["id", "password"]);
			expect(authData).not.toHaveProperty("name");
			expect(authData).not.toHaveProperty("email");
			expect(authData).not.toHaveProperty("type");
		});
	});

	describe("métodos auxiliares", () => {
		it("clear deve limpar todos os usuários", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};
			await repository.create(userData);
			await repository.create(userData);

			repository.clear();

			expect(repository.count()).toBe(0);
			expect(repository.findAll()).toEqual([]);
		});

		it("count deve retornar o número correto de usuários", async () => {
			const userData: CreateUserDTO = {
				name: "João Silva",
				email: "joao@example.com",
				password: "Password123!",
				type: "PATIENT",
			};

			expect(repository.count()).toBe(0);

			await repository.create(userData);
			expect(repository.count()).toBe(1);

			await repository.create({ ...userData, email: "outro@example.com" });
			expect(repository.count()).toBe(2);
		});

		it("findAll deve retornar todos os usuários", async () => {
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
			const users = repository.findAll();

			expect(users).toHaveLength(2);
			expect(users[0].name).toBe("João Silva");
			expect(users[1].name).toBe("Maria Santos");
		});
	});
});
