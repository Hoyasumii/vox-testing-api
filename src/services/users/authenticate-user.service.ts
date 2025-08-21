import { AuthenticateUserDTO } from "@/dtos/users";
import { type UsersRepositoryBase } from "@/repositories";
import { Service } from "@/types";
import { PasswordHasher } from "@/utils";

export class AuthenticateUserService extends Service<
	UsersRepositoryBase,
	AuthenticateUserDTO,
	string
> {
	async run(data: AuthenticateUserDTO): Promise<string> {
		const hasher = new PasswordHasher(process.env.ARGON_SECRET);
		const { success } = AuthenticateUserDTO.safeParse(data);

		if (!success) return this.repository.errors.badRequest();

		const userAuthData = await this.repository.getByEmail(data.email);

		if (!userAuthData) return this.repository.errors.badRequest();

		const isPasswordValid = await hasher.verify(
			userAuthData.password,
			data.password,
		);

		if (!isPasswordValid) return this.repository.errors.badRequest();

		return await this.repository.channel.talk("jwt:sign", {
			userId: userAuthData.id,
		}) as string;
	}
}
