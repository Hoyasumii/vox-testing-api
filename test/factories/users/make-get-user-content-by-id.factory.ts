import { MemoryCache } from "../../cache";
import { UsersRepository } from "../../repositories";
import { GetUserContentByIdService } from "@/services/users/get-user-content-by-id.service";

export function makeGetUserContentByIdFactory() {
	const cache = new MemoryCache();
	const repository = new UsersRepository(cache);
	return new GetUserContentByIdService(repository);
}
