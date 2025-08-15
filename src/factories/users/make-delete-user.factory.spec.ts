import { makeDeleteUserFactory } from "./make-delete-user.factory";
import { DeleteUserService } from "@/services/users/delete-user.service";
import { UsersRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	UsersRepository: jest.fn(),
}));

describe("makeDeleteUserFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de DeleteUserService", () => {
		// Act
		const service = makeDeleteUserFactory();

		// Assert
		expect(service).toBeInstanceOf(DeleteUserService);
	});

	it("deve usar o UsersRepository do Prisma", () => {
		// Act
		makeDeleteUserFactory();

		// Assert
		expect(UsersRepository).toHaveBeenCalledTimes(1);
	});
});
