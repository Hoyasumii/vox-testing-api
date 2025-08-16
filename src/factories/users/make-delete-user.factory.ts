import { RedisCache } from "@/cache";
import channels from "@/channels";
import { UsersRepository } from "@/repositories/prisma";
import { DeleteUserService } from "@/services/users/delete-user.service";

export function makeDeleteUserFactory() {
	const cache = new RedisCache();
	const repository = new UsersRepository(cache, channels);
	return new DeleteUserService(repository);
}
