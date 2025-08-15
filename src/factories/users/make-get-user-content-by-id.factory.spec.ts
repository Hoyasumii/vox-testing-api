import { makeGetUserContentByIdFactory } from "./make-get-user-content-by-id.factory";
import { GetUserContentByIdService } from "@/services/users/get-user-content-by-id.service";
import { UsersRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	UsersRepository: jest.fn(),
}));

describe("makeGetUserContentByIdFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de GetUserContentByIdService", () => {
		// Act
		const service = makeGetUserContentByIdFactory();

		// Assert
		expect(service).toBeInstanceOf(GetUserContentByIdService);
	});

	it("deve usar o UsersRepository do Prisma", () => {
		// Act
		makeGetUserContentByIdFactory();

		// Assert
		expect(UsersRepository).toHaveBeenCalledTimes(1);
	});
});
