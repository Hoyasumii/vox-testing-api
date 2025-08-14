import {
	CreateUserDTO,
	UpdateUserDTO,
	UserResponseDTO,
	UserAuthResponseDTO,
	GetUserByEmailDTO,
} from "@/dtos/users";
import type { UserType } from "@/dtos/users";
import { UsersRepositoryBase } from "@/repositories/users-repository.base";
import { randomUUID } from "node:crypto";

interface InMemoryUser {
	id: string;
	name: string;
	email: string;
	password: string;
	type: UserType;
	createdAt: Date;
	updatedAt: Date;
}

export class UsersRepository extends UsersRepositoryBase {
	private users: InMemoryUser[] = [];

	private generateId(): string {
		return randomUUID();
	}

	async create(data: CreateUserDTO): Promise<string> {
		const id = this.generateId();
		const now = new Date();

		const user: InMemoryUser = {
			id,
			name: data.name,
			email: data.email,
			password: data.password,
			type: data.type || "PATIENT",
			createdAt: now,
			updatedAt: now,
		};

		this.users.push(user);
		return id;
	}

	async update(id: string, data: UpdateUserDTO): Promise<boolean> {
		const userIndex = this.users.findIndex((u) => u.id === id);

		if (userIndex === -1) {
			return false;
		}

		const user = this.users[userIndex];
		this.users[userIndex] = {
			...user,
			...(data.name && { name: data.name }),
			...(data.email && { email: data.email }),
			...(data.type && { type: data.type }),
			updatedAt: new Date(),
		};

		return true;
	}

	async delete(id: string): Promise<boolean> {
		const userIndex = this.users.findIndex((u) => u.id === id);

		if (userIndex === -1) {
			return false;
		}

		this.users.splice(userIndex, 1);
		return true;
	}

	async getById(id: string): Promise<UserResponseDTO | null> {
		const user = this.users.find((u) => u.id === id);

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			name: user.name,
			email: user.email,
			type: user.type,
			createdAt: user.createdAt,
			updatedAt: user.updatedAt,
		};
	}

	async getByEmail(
		data: GetUserByEmailDTO,
	): Promise<UserAuthResponseDTO | null> {
		const user = this.users.find((u) => u.email === data);

		if (!user) {
			return null;
		}

		return {
			id: user.id,
			password: user.password,
		};
	}

	clear(): void {
		this.users = [];
	}

	count(): number {
		return this.users.length;
	}

	findAll(): InMemoryUser[] {
		return [...this.users];
	}
}
