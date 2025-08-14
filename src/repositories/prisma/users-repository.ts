import type { email, uuid } from "@/dtos";
import type {
	CreateUserDTO,
	UpdateUserDTO,
	UserAuthResponseDTO,
	UserResponseDTO,
} from "@/dtos/users";
import { UsersRepositoryBase } from "@/repositories";
import { prisma } from "@/utils";

export class UsersRepository extends UsersRepositoryBase {
	async create(data: CreateUserDTO): Promise<uuid> {
		const { id } = await prisma.user.create({ data });

		return id;
	}

	async delete(id: uuid): Promise<boolean> {
		const deletedUser = await prisma.user.deleteMany({ where: { id } });

		return deletedUser.count === 1;
	}

	async getByEmail(
		email: email,
	): Promise<UserAuthResponseDTO | null> {
		const targetUser = await prisma.user.findUnique({
			where: { email },
			select: {
				id: true,
				password: true,
			},
		});

		return targetUser;
	}

	async getById(id: uuid): Promise<UserResponseDTO | null> {
		return await prisma.user.findUnique({
			where: { id },
			omit: { password: true },
		});
	}

	async update(id: string, data: UpdateUserDTO): Promise<boolean> {
		const updatedUser = await prisma.user.updateMany({ where: { id }, data });

		return updatedUser.count === 1;
	}
}
