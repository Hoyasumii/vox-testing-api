import { uuid } from "@/dtos";
import { type UserResponseDTO } from "@/dtos/users";
import type { UsersRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class GetUserContentByIdService extends Service<
	UsersRepositoryBase,
	uuid,
	UserResponseDTO
> {
	async run(id: uuid): Promise<UserResponseDTO> {
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		const userContent = await this.repository.getById(id);

		if (!userContent) return this.repository.errors.notFound();

		return userContent;
	}
}
