import { makeUpdateUserFactory } from "./make-update-user.factory";
import { UpdateUserService } from "@/services/users/update-user.service";
import { UsersRepository } from "@/repositories/prisma";

jest.mock("@/repositories/prisma", () => ({
	UsersRepository: jest.fn(),
}));

describe("makeUpdateUserFactory", () => {
	beforeEach(() => {
		jest.clearAllMocks();
	});

	it("deve retornar uma instância de UpdateUserService", () => {
		// Act
		const service = makeUpdateUserFactory();

		// Assert
		expect(service).toBeInstanceOf(UpdateUserService);
	});

	it("deve usar o UsersRepository do Prisma", () => {
		// Act
		makeUpdateUserFactory();

		// Assert
		expect(UsersRepository).toHaveBeenCalledTimes(1);
	});
});
