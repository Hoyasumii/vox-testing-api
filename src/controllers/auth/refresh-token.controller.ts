import { Controller, Post, Headers, BadRequestException, UnauthorizedException } from "@nestjs/common";
import { VerifyJwtToken, RefreshJwtToken } from "@/services/jwt";

@Controller()
export class RefreshTokenController {
	constructor(
		private verifyJwtToken: VerifyJwtToken,
		private refreshJwtToken: RefreshJwtToken
	) {}

	@Post()
	async refresh(@Headers("authorization") authorization?: string) {
		if (!authorization) {
			throw new BadRequestException("Token de autorização é obrigatório");
		}

		const token = this.extractTokenFromHeader(authorization);
		
		try {
			// Verificar se o token é válido
			await this.verifyJwtToken.run(token);
			
			// Renovar o token
			const newToken = await this.refreshJwtToken.run(token);
			
			return { token: newToken };
		} catch {
			throw new UnauthorizedException("Token inválido ou expirado");
		}
	}

	private extractTokenFromHeader(authorization: string): string {
		const [type, token] = authorization.split(" ");
		
		if (type !== "Bearer" || !token) {
			throw new BadRequestException("Formato de token inválido. Use: Bearer <token>");
		}
		
		return token;
	}
}