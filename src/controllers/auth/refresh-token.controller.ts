import {
	Controller,
	Post,
	Headers,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { VerifyJwtToken, RefreshJwtToken } from "@/services/jwt";

@Controller()
export class RefreshTokenController {
	constructor(
		private verifyJwtToken: VerifyJwtToken,
		private refreshJwtToken: RefreshJwtToken,
	) {}

	@Post()
	async refresh(@Headers("authorization") authorization?: string) {
		if (!authorization || authorization.trim() === "") {
			throw new BadRequestException("Token de autorização é obrigatório");
		}

		try {
			await this.verifyJwtToken.run(authorization);

			const newToken = await this.refreshJwtToken.run(authorization);

			return { token: newToken };
		} catch {
			throw new UnauthorizedException("Token inválido ou expirado");
		}
	}
}
