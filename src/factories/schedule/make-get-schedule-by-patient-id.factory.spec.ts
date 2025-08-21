import { makeGetScheduleByPatientIdFactory } from "./make-get-schedule-by-patient-id.factory";
import { GetScheduleByPatientIdService } from "@/services/schedule";
import { ScheduleRepository } from "@/repositories/prisma";

// Mock do MemoryCache para testes
class MemoryCache {
	private cache = new Map();
	async set(key: string, value: any, ex?: number) { this.cache.set(key, value); }
	async get(key: string) { return this.cache.get(key) || null; }
	async del(key: string) { return this.cache.delete(key); }
}

jest.mock("@/repositories/prisma", () => ({
	ScheduleRepository: jest.fn(),
}));

jest.mock("@/cache", () => ({
	RedisCache: jest.fn().mockImplementation(() => new MemoryCache()),
}));

jest.mock("@/channels", () => ({
	__esModule: true,
	default: {
		"schedule:create": jest.fn(),
		"schedule:update": jest.fn(),
		"schedule:delete": jest.fn(),
		"schedule:cancel": jest.fn(),
		"schedule:complete": jest.fn(),
	},
}));

describe("makeGetScheduleByPatientIdFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de GetScheduleByPatientIdService", () => {
		// Act
		const service = makeGetScheduleByPatientIdFactory();

		// Assert
		expect(service).toBeInstanceOf(GetScheduleByPatientIdService);
	});

	it("deve usar o ScheduleRepository do Prisma com cache e channels", () => {
		// Arrange
		const mockChannels = require("@/channels").default;

		// Act
		makeGetScheduleByPatientIdFactory();

		// Assert
		expect(ScheduleRepository).toHaveBeenCalledTimes(1);
		expect(ScheduleRepository).toHaveBeenCalledWith(expect.any(MemoryCache), mockChannels);
	});
});
