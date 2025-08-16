import { RedisCache } from "@/cache";
import channels from "@/channels";
import { UsersRepository } from "@/repositories/prisma";
import { AuthenticateUserService } from "@/services/users/authenticate-user.service";

export function makeAuthenticateUserFactory() {
	const cache = new RedisCache();
	const repository = new UsersRepository(cache, channels);
	return new AuthenticateUserService(repository);
}
