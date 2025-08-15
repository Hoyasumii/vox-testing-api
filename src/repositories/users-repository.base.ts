import { CacheableRepositoryBase } from "@/types";
import {
	CreateUserDTO,
	UpdateUserDTO,
	UserResponseDTO,
	UserAuthResponseDTO,
} from "@/dtos/users";
import type { email, uuid } from "@/dtos";

export abstract class UsersRepositoryBase extends CacheableRepositoryBase {
	abstract create(data: CreateUserDTO): Promise<uuid>;
	abstract update(id: string, data: UpdateUserDTO): Promise<boolean>;
	abstract delete(data: uuid): Promise<boolean>;
	abstract getById(data: uuid): Promise<UserResponseDTO | null>;
	abstract getByEmail(data: email): Promise<UserAuthResponseDTO | null>;
}
