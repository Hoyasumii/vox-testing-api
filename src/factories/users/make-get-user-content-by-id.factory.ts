import { RedisCache } from "@/cache";
import channels from "@/channels";
import { UsersRepository } from "@/repositories/prisma";
import { GetUserContentByIdService } from "@/services/users/get-user-content-by-id.service";

export function makeGetUserContentByIdFactory() {
	const cache = new RedisCache();
	const repository = new UsersRepository(cache, channels);
	return new GetUserContentByIdService(repository);
}
