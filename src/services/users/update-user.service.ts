import { uuid } from "@/dtos";
import { UpdateUserDTO } from "@/dtos/users";
import type { UsersRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class UpdateUserService extends Service<
	UsersRepositoryBase,
	{ id: string; data: UpdateUserDTO },
	boolean
> {
	async run({ data, id }: { id: uuid; data: UpdateUserDTO }): Promise<boolean> {
		const { success: idIsValid } = uuid.safeParse(id);
		const { success: updatedDataIsValid } = UpdateUserDTO.safeParse(data);

		if (!idIsValid || !updatedDataIsValid) {
			return this.repository.errors.badRequest();
		}

		return this.repository.update(id, data);
	}
}
