import { GetUserByEmailDTO, UserAuthResponseDTO } from "@/dtos/users";
import type { UsersRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class GetAuthContentByEmailService extends Service<
	UsersRepositoryBase,
	GetUserByEmailDTO,
	UserAuthResponseDTO
> {
	async run(data: GetUserByEmailDTO): Promise<UserAuthResponseDTO> {
		const { success } = GetUserByEmailDTO.safeParse(data);

		if (!success) return this.repository.errors.badRequest();

		const userContent = await this.repository.getByEmail(data);

		if (!userContent) return this.repository.errors.notFound();

		return userContent;
	}
}
