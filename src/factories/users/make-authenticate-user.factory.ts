import { UsersRepository } from "@/repositories/prisma";
import { AuthenticateUserService } from "@/services/users/authenticate-user.service";

export function makeAuthenticateUserFactory() {
	const repository = new UsersRepository();
	return new AuthenticateUserService(repository);
}
