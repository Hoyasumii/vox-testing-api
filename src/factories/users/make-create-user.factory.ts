import { UsersRepository } from "@/repositories/prisma";
import { CreateUserService } from "@/services/users/create-user.service";

export function makeCreateUserFactory() {
	const repository = new UsersRepository();
	return new CreateUserService(repository);
}
