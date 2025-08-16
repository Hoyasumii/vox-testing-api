import type { uuid } from "@/dtos";
import { CreateUserDTO } from "@/dtos/users";
import type { UsersRepositoryBase } from "@/repositories";
import { Service } from "@/types";
import { PasswordHasher } from "@/utils";
import z from "zod";

export class CreateUserService extends Service<
	UsersRepositoryBase,
	CreateUserDTO,
	uuid
> {
	async run(data: CreateUserDTO): Promise<string> {
		const hasher = new PasswordHasher(process.env.ARGON_SECRET);
		const { success, error } = CreateUserDTO.safeParse(data);

		if (!success)
			return this.repository.errors.badRequest(
				JSON.stringify(z.treeifyError(error)),
			);

		data.password = await hasher.hash(data.password);

		try {
			const userId = await this.repository.create(data);

			if (data.type === "DOCTOR") {
				await this.repository.channel.talk<uuid, boolean>(
					"doctor:create",
					userId,
				);
			}

			return userId;
		} catch (_) {
			return this.repository.errors.internalServer();
		}
	}
}
