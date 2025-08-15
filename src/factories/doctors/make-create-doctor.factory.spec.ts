import { makeCreateDoctorFactory } from "./make-create-doctor.factory";
import { CreateDoctorService } from "@/services/doctors";
import { DoctorsRepository } from "@/repositories/prisma";

// Mock do MemoryCache para testes
class MemoryCache {
	private cache = new Map();
	async set(key: string, value: any, ex?: number) { this.cache.set(key, value); }
	async get(key: string) { return this.cache.get(key) || null; }
	async del(key: string) { return this.cache.delete(key); }
}

jest.mock("@/repositories/prisma", () => ({
	DoctorsRepository: jest.fn(),
}));

jest.mock("@/cache", () => ({
	RedisCache: jest.fn().mockImplementation(() => new MemoryCache()),
}));

describe("makeCreateDoctorFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de CreateDoctorService", () => {
		// Act
		const service = makeCreateDoctorFactory();

		// Assert
		expect(service).toBeInstanceOf(CreateDoctorService);
	});

	it("deve usar o DoctorsRepository do Prisma", () => {
		// Act
		makeCreateDoctorFactory();

		// Assert
		expect(DoctorsRepository).toHaveBeenCalledTimes(1);
	});
});
