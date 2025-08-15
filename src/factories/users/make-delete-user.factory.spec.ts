import { makeDeleteUserFactory } from "./make-delete-user.factory";
import { DeleteUserService } from "@/services/users/delete-user.service";
import { UsersRepository } from "@/repositories/prisma";

// Mock do MemoryCache para testes
class MemoryCache {
	private cache = new Map();
	async set(key: string, value: any, ex?: number) { this.cache.set(key, value); }
	async get(key: string) { return this.cache.get(key) || null; }
	async del(key: string) { return this.cache.delete(key); }
}

jest.mock("@/repositories/prisma", () => ({
	UsersRepository: jest.fn(),
}));

jest.mock("@/cache", () => ({
	RedisCache: jest.fn().mockImplementation(() => new MemoryCache()),
}));

describe("makeDeleteUserFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de DeleteUserService", () => {
		// Act
		const service = makeDeleteUserFactory();

		// Assert
		expect(service).toBeInstanceOf(DeleteUserService);
	});

	it("deve usar o UsersRepository do Prisma com cache", () => {
		// Act
		makeDeleteUserFactory();

		// Assert
		expect(UsersRepository).toHaveBeenCalledTimes(1);
		expect(UsersRepository).toHaveBeenCalledWith(expect.any(MemoryCache));
	});
});
