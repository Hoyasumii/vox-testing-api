import { AuthenticateUserDTO, type UserAuthResponseDTO } from "@/dtos/users";
import { EmptyRepository, type UsersRepositoryBase } from "@/repositories";
import { Service } from "@/types";
import { PasswordHasher } from "@/utils";
import { SignJwtToken } from "../jwt";

export class AuthenticateUserService extends Service<
	UsersRepositoryBase,
	AuthenticateUserDTO,
	string
> {
	async run(data: AuthenticateUserDTO): Promise<string> {
		const jwt = new SignJwtToken(new EmptyRepository());
		const exp = 60 * 60 * 24;

		const hasher = new PasswordHasher(process.env.ARGON_SECRET);
		const { success } = AuthenticateUserDTO.safeParse(data);

		if (!success) return this.repository.errors.badRequest();

		const cachedUserAuthData = await this.repository.cache.get<string>(
			`user-email-${data.email}`,
		);

		const userAuthData = cachedUserAuthData
			? (JSON.parse(cachedUserAuthData) as UserAuthResponseDTO)
			: await this.repository.getByEmail(data.email);

		if (!userAuthData) return this.repository.errors.badRequest();

		if (!cachedUserAuthData) {
			await this.repository.cache.set(
				`user-email-${data.email}`,
				JSON.stringify(userAuthData),
				exp,
			);
		}

		const isPasswordValid = await hasher.verify(
			userAuthData.password,
			data.password,
		);

		if (!isPasswordValid) return this.repository.errors.badRequest();

		return await jwt.run({ userId: userAuthData.id });
	}
}
