import { RedisCache } from "@/cache";
import channels from "@/channels";
import { UsersRepository } from "@/repositories/prisma";
import { UpdateUserService } from "@/services/users/update-user.service";

export function makeUpdateUserFactory() {
	const cache = new RedisCache();
	const repository = new UsersRepository(cache, channels);
	return new UpdateUserService(repository);
}
