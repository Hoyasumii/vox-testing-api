import { UsersRepository } from "@/repositories/prisma";
import { GetUserContentByIdService } from "@/services/users/get-user-content-by-id.service";

export function makeGetUserContentByIdFactory() {
	const repository = new UsersRepository();
	return new GetUserContentByIdService(repository);
}
