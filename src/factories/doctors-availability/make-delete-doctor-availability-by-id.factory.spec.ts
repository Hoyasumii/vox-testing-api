import { makeDeleteDoctorAvailabilityByIdFactory } from "./make-delete-doctor-availability-by-id.factory";
import { DeleteDoctorAvailabilityByIdService } from "@/services/doctors-availability";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	DoctorsAvailabilityRepository: jest.fn(),
}));

describe("makeDeleteDoctorAvailabilityByIdFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de DeleteDoctorAvailabilityByIdService", () => {
		// Act
		const service = makeDeleteDoctorAvailabilityByIdFactory();

		// Assert
		expect(service).toBeInstanceOf(DeleteDoctorAvailabilityByIdService);
	});

	it("deve usar o DoctorsAvailabilityRepository do Prisma", () => {
		// Act
		makeDeleteDoctorAvailabilityByIdFactory();

		// Assert
		expect(DoctorsAvailabilityRepository).toHaveBeenCalledTimes(1);
	});
});
