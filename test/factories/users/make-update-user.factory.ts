import { MemoryCache } from "../../cache";
import { UsersRepository } from "../../repositories";
import { UpdateUserService } from "@/services/users/update-user.service";

export function makeUpdateUserFactory() {
	const cache = new MemoryCache();
	const repository = new UsersRepository(cache);
	return new UpdateUserService(repository);
}
