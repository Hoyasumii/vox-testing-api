import { makeCreateDoctorAvailabilityFactory } from "./make-create-doctor-availability.factory";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	DoctorsAvailabilityRepository: jest.fn(),
}));

describe("makeCreateDoctorAvailabilityFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de CreateDoctorAvailabilityService", () => {
		// Act
		const service = makeCreateDoctorAvailabilityFactory();

		// Assert
		expect(service).toBeInstanceOf(CreateDoctorAvailabilityService);
	});

	it("deve usar o DoctorsAvailabilityRepository do Prisma", () => {
		// Act
		makeCreateDoctorAvailabilityFactory();

		// Assert
		expect(DoctorsAvailabilityRepository).toHaveBeenCalledTimes(1);
	});
});
