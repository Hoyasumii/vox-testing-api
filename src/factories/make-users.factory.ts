import { UsersRepository } from "@/repositories/prisma";
import { AuthenticateUserService } from "@/services/users/authenticate-user.service";
import { CreateUserService } from "@/services/users/create-user.service";
import { DeleteUserService } from "@/services/users/delete-user.service";
import { GetUserContentByIdService } from "@/services/users/get-user-content-by-id.service";
import { UpdateUserService } from "@/services/users/update-user.service";

export function makeCreateUserFactory() {
	const repository = new UsersRepository();
	return new CreateUserService(repository);
}

export function makeAuthenticateUserFactory() {
	const repository = new UsersRepository();
	return new AuthenticateUserService(repository);
}

export function makeDeleteUserFactory() {
	const repository = new UsersRepository();
	return new DeleteUserService(repository);
}

export function makeGetUserContentByIdFactory() {
	const repository = new UsersRepository();
	return new GetUserContentByIdService(repository);
}

export function makeUpdateUserFactory() {
	const repository = new UsersRepository();
	return new UpdateUserService(repository);
}
