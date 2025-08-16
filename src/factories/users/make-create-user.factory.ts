import { RedisCache } from "@/cache";
import channels from "@/channels";
import { UsersRepository } from "@/repositories/prisma";
import { CreateUserService } from "@/services/users/create-user.service";

export function makeCreateUserFactory() {
	const cache = new RedisCache();
	const repository = new UsersRepository(cache, channels);
	return new CreateUserService(repository);
}
