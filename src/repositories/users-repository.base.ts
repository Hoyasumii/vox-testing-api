import { RepositoryBase } from "@/types";
import {
	CreateUserDTO,
	UpdateUserDTO,
	UserResponseDTO,
	UserAuthResponseDTO,
	GetUserByEmailDTO,
} from "@/dtos/users";
import type { uuid } from "@/dtos";

export abstract class UsersRepositoryBase extends RepositoryBase {
	abstract create(data: CreateUserDTO): Promise<uuid>;
	abstract update(id: string, data: UpdateUserDTO): Promise<boolean>;
	abstract delete(data: uuid): Promise<boolean>;
	abstract getById(data: uuid): Promise<UserResponseDTO | null>;
	abstract getByEmail(
		data: GetUserByEmailDTO,
	): Promise<UserAuthResponseDTO | null>;
}
