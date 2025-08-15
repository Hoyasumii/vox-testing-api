import { makeDoctorExistsFactory } from "./make-doctor-exists.factory";
import { DoctorExistsService } from "@/services/doctors";
import { DoctorsRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	DoctorsRepository: jest.fn(),
}));

describe("makeDoctorExistsFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de DoctorExistsService", () => {
		// Act
		const service = makeDoctorExistsFactory();

		// Assert
		expect(service).toBeInstanceOf(DoctorExistsService);
	});

	it("deve usar o DoctorsRepository do Prisma", () => {
		// Act
		makeDoctorExistsFactory();

		// Assert
		expect(DoctorsRepository).toHaveBeenCalledTimes(1);
	});
});
