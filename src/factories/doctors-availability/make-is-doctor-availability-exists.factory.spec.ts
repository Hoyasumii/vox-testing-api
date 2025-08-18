import { makeIsDoctorAvailabilityExistsFactory } from "./make-is-doctor-availability-exists.factory";
import { IsDoctorAvailabilityExistsService } from "@/services/doctors-availability";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";

// Mock do MemoryCache para testes
class MemoryCache {
	private cache = new Map();
	async set(key: string, value: any, ex?: number) { this.cache.set(key, value); }
	async get(key: string) { return this.cache.get(key) || null; }
	async del(key: string) { return this.cache.delete(key); }
}

jest.mock("@/repositories/prisma", () => ({
	DoctorsAvailabilityRepository: jest.fn(),
}));

jest.mock("@/cache", () => ({
	RedisCache: jest.fn().mockImplementation(() => new MemoryCache()),
}));

describe("makeIsDoctorAvailabilityExistsFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de IsDoctorAvailabilityExistsService", () => {
		// Act
		const service = makeIsDoctorAvailabilityExistsFactory();

		// Assert
		expect(service).toBeInstanceOf(IsDoctorAvailabilityExistsService);
	});

	it("deve usar o DoctorsAvailabilityRepository do Prisma", () => {
		// Act
		makeIsDoctorAvailabilityExistsFactory();

		// Assert
		expect(DoctorsAvailabilityRepository).toHaveBeenCalledTimes(1);
	});
});
