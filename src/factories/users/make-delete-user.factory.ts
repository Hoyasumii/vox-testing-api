import { UsersRepository } from "@/repositories/prisma";
import { DeleteUserService } from "@/services/users/delete-user.service";

export function makeDeleteUserFactory() {
	const repository = new UsersRepository();
	return new DeleteUserService(repository);
}
