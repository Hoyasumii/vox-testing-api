import { RedisCache } from "@/cache";
import { UsersRepository } from "@/repositories/prisma";
import { AuthenticateUserService } from "@/services/users/authenticate-user.service";

export function makeAuthenticateUserFactory() {
	const cache = new RedisCache();
	const repository = new UsersRepository(cache);
	return new AuthenticateUserService(repository);
}
