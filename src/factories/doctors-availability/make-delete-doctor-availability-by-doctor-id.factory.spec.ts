import { makeDeleteDoctorAvailabilityByDoctorIdFactory } from "./make-delete-doctor-availability-by-doctor-id.factory";
import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	DoctorsAvailabilityRepository: jest.fn(),
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
