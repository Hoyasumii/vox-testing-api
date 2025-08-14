import { uuid } from "@/dtos";
import type { UsersRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class DeleteUserService extends Service<
	UsersRepositoryBase,
	uuid,
	boolean
> {
	async run(id: uuid): Promise<boolean> {
		const { success } = uuid.safeParse(id);

		if (!success) this.repository.errors.badRequest();

		return await this.repository.delete(id);
	}
}
