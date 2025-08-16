import { MemoryCache } from "../../cache";
import { UsersRepository } from "../../repositories";
import { DeleteUserService } from "@/services/users/delete-user.service";

export function makeDeleteUserFactory() {
	const cache = new MemoryCache();
	const repository = new UsersRepository(cache);
	return new DeleteUserService(repository);
}
