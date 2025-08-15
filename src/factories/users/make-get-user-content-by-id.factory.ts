import { RedisCache } from "@/cache";
import { UsersRepository } from "@/repositories/prisma";
import { GetUserContentByIdService } from "@/services/users/get-user-content-by-id.service";

export function makeGetUserContentByIdFactory() {
	const cache = new RedisCache();
	const repository = new UsersRepository(cache);
	return new GetUserContentByIdService(repository);
}
