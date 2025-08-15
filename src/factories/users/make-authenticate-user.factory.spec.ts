import { makeAuthenticateUserFactory } from "./make-authenticate-user.factory";
import { AuthenticateUserService } from "@/services/users/authenticate-user.service";
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

describe("makeAuthenticateUserFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de AuthenticateUserService", () => {
		// Act
		const service = makeAuthenticateUserFactory();

		// Assert
		expect(service).toBeInstanceOf(AuthenticateUserService);
	});

	it("deve usar o UsersRepository do Prisma com cache", () => {
		// Act
		makeAuthenticateUserFactory();

		// Assert
		expect(UsersRepository).toHaveBeenCalledTimes(1);
		expect(UsersRepository).toHaveBeenCalledWith(expect.any(MemoryCache));
	});
});
