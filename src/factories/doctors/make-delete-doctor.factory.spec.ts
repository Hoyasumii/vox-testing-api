import { makeDeleteDoctorFactory } from "./make-delete-doctor.factory";
import { DeleteDoctorService } from "@/services/doctors";
import { DoctorsRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	DoctorsRepository: jest.fn(),
}));

describe("makeDeleteDoctorFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de DeleteDoctorService", () => {
		// Act
		const service = makeDeleteDoctorFactory();

		// Assert
		expect(service).toBeInstanceOf(DeleteDoctorService);
	});

	it("deve usar o DoctorsRepository do Prisma", () => {
		// Act
		makeDeleteDoctorFactory();

		// Assert
		expect(DoctorsRepository).toHaveBeenCalledTimes(1);
	});
});
