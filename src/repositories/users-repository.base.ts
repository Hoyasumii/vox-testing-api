import { RepositoryBase } from "@/types";
import {
	CreateUserDto,
	UpdateUserDto,
	UserResponseDto,
	GetUserByIdDto,
	GetUserByEmailDto,
	DeleteUserDto,
} from "@/dtos/users";

export abstract class UsersRepositoryBase extends RepositoryBase {
	abstract create(data: CreateUserDto): Promise<UserResponseDto>;
	abstract update(id: string, data: UpdateUserDto): Promise<UserResponseDto>;
	abstract delete(data: DeleteUserDto): Promise<void>;
	abstract getById(data: GetUserByIdDto): Promise<UserResponseDto | null>;
	abstract getByEmail(data: GetUserByEmailDto): Promise<UserResponseDto | null>;
}