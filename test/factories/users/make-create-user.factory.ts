import { MemoryCache } from "../../cache";
import { UsersRepository } from "../../repositories";
import { CreateUserService } from "@/services/users/create-user.service";

export function makeCreateUserFactory() {
	const cache = new MemoryCache();
	const repository = new UsersRepository(cache);
	return new CreateUserService(repository);
}
