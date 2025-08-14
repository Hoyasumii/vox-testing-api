import { UsersRepository } from "@/repositories/prisma";
import { UpdateUserService } from "@/services/users/update-user.service";

export function makeUpdateUserFactory() {
	const repository = new UsersRepository();
	return new UpdateUserService(repository);
}
