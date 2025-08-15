import { makeGetUserContentByIdFactory } from "./make-get-user-content-by-id.factory";
import { GetUserContentByIdService } from "@/services/users/get-user-content-by-id.service";
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

describe("makeGetUserContentByIdFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de GetUserContentByIdService", () => {
		// Act
		const service = makeGetUserContentByIdFactory();

		// Assert
		expect(service).toBeInstanceOf(GetUserContentByIdService);
	});

	it("deve usar o UsersRepository do Prisma com cache", () => {
		// Act
		makeGetUserContentByIdFactory();

		// Assert
		expect(UsersRepository).toHaveBeenCalledTimes(1);
		expect(UsersRepository).toHaveBeenCalledWith(expect.any(MemoryCache));
	});
});
