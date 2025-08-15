import { makeCreateDoctorFactory } from "./make-create-doctor.factory";
import { CreateDoctorService } from "@/services/doctors";
import { DoctorsRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	DoctorsRepository: jest.fn(),
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
