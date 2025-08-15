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
		const ex = 60 * 60 * 24;
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		const cachedUserContent = await this.repository.cache.get<string>(
			`user-${id}`,
		);

		const userContent = cachedUserContent
			? (JSON.parse(cachedUserContent) as UserResponseDTO)
			: await this.repository.getById(id);

		if (!userContent) return this.repository.errors.notFound();

		if (!cachedUserContent) {
			await this.repository.cache.set(
				`user-${id}`,
				JSON.stringify(userContent),
				ex,
			);
		}

		return userContent;
	}
}
