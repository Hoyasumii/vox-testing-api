import { makeCreateUserFactory } from "./make-create-user.factory";
import { CreateUserService } from "@/services/users/create-user.service";
import { UsersRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	UsersRepository: jest.fn(),
}));

describe("makeCreateUserFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de CreateUserService", () => {
		// Act
		const service = makeCreateUserFactory();

		// Assert
		expect(service).toBeInstanceOf(CreateUserService);
	});

	it("deve usar o UsersRepository do Prisma", () => {
		// Act
		makeCreateUserFactory();

		// Assert
		expect(UsersRepository).toHaveBeenCalledTimes(1);
	});
});
