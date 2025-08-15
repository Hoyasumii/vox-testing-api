import { makeDeleteDoctorAvailabilityByDoctorIdFactory } from "./make-delete-doctor-availability-by-doctor-id.factory";
import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";
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

describe("makeDeleteDoctorAvailabilityByDoctorIdFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de DeleteDoctorAvailabilityByDoctorIdService", () => {
		// Act
		const service = makeDeleteDoctorAvailabilityByDoctorIdFactory();

		// Assert
		expect(service).toBeInstanceOf(DeleteDoctorAvailabilityByDoctorIdService);
	});

	it("deve usar o DoctorsAvailabilityRepository do Prisma", () => {
		// Act
		makeDeleteDoctorAvailabilityByDoctorIdFactory();

		// Assert
		expect(DoctorsAvailabilityRepository).toHaveBeenCalledTimes(1);
	});
});
