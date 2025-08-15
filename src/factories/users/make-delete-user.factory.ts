import { RedisCache } from "@/cache";
import { UsersRepository } from "@/repositories/prisma";
import { DeleteUserService } from "@/services/users/delete-user.service";

export function makeDeleteUserFactory() {
	const cache = new RedisCache();
	const repository = new UsersRepository(cache);
	return new DeleteUserService(repository);
}
