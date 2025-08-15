import { makeAuthenticateUserFactory } from "./make-authenticate-user.factory";
import { AuthenticateUserService } from "@/services/users/authenticate-user.service";
import { UsersRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	UsersRepository: jest.fn(),
}));

describe("makeAuthenticateUserFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de AuthenticateUserService", () => {
		// Act
		const service = makeAuthenticateUserFactory();

		// Assert
		expect(service).toBeInstanceOf(AuthenticateUserService);
	});

	it("deve usar o UsersRepository do Prisma", () => {
		// Act
		makeAuthenticateUserFactory();

		// Assert
		expect(UsersRepository).toHaveBeenCalledTimes(1);
	});
});
