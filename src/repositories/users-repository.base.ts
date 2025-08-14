import { RepositoryBase } from "@/types";
import {
	CreateUserDto,
	UpdateUserDto,
	UserResponseDto,
	UserAuthResponseDto,
	GetUserByEmailDto,
} from "@/dtos/users";
import type { uuid } from "@/dtos";

export abstract class UsersRepositoryBase extends RepositoryBase {
	abstract create(data: CreateUserDto): Promise<uuid>;
	abstract update(id: string, data: UpdateUserDto): Promise<boolean>;
	abstract delete(data: uuid): Promise<boolean>;
	abstract getById(data: uuid): Promise<UserResponseDto | null>;
	abstract getByEmail(
		data: GetUserByEmailDto,
	): Promise<UserAuthResponseDto | null>;
}
