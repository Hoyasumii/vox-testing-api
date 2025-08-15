import { makeUpdateDoctorAvailabilityFactory } from "./make-update-doctor-availability.factory";
import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	DoctorsAvailabilityRepository: jest.fn(),
}));

describe("makeUpdateDoctorAvailabilityFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de UpdateDoctorAvailabilityService", () => {
		// Act
		const service = makeUpdateDoctorAvailabilityFactory();

		// Assert
		expect(service).toBeInstanceOf(UpdateDoctorAvailabilityService);
	});

	it("deve usar o DoctorsAvailabilityRepository do Prisma", () => {
		// Act
		makeUpdateDoctorAvailabilityFactory();

		// Assert
		expect(DoctorsAvailabilityRepository).toHaveBeenCalledTimes(1);
	});
});
