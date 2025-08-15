import { makeFindByDoctorIdFactory } from "./make-find-by-doctor-id.factory";
import { FindByDoctorIdService } from "@/services/doctors-availability";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	DoctorsAvailabilityRepository: jest.fn(),
}));

describe("makeFindByDoctorIdFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de FindByDoctorIdService", () => {
		// Act
		const service = makeFindByDoctorIdFactory();

		// Assert
		expect(service).toBeInstanceOf(FindByDoctorIdService);
	});

	it("deve usar o DoctorsAvailabilityRepository do Prisma", () => {
		// Act
		makeFindByDoctorIdFactory();

		// Assert
		expect(DoctorsAvailabilityRepository).toHaveBeenCalledTimes(1);
	});
});
