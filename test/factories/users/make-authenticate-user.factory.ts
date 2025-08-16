import { MemoryCache } from "../../cache";
import { UsersRepository } from "../../repositories";
import { AuthenticateUserService } from "@/services/users/authenticate-user.service";

export function makeAuthenticateUserFactory() {
	const cache = new MemoryCache();
	const repository = new UsersRepository(cache);
	return new AuthenticateUserService(repository);
}
