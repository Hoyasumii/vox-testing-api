import {
	Controller,
	Post,
	Headers,
	BadRequestException,
	UnauthorizedException,
} from "@nestjs/common";
import { VerifyJwtToken, RefreshJwtToken } from "@/services/jwt";
import { RefreshToken } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";

@ApiTags("🔐 Autenticação")
@Controller()
export class RefreshTokenController {
	constructor(
		private verifyJwtToken: VerifyJwtToken,
		private refreshJwtToken: RefreshJwtToken,
	) {}

	@Post()
	@ApiOperation({ 
		summary: "Renovar token JWT",
		description: "Renova um token JWT válido para estender a sessão do usuário"
	})
	@ApiHeader({
		name: "authorization",
		description: "Token JWT para renovação",
		required: true
	})
	@ApiResponse({ 
		status: 200, 
		description: "Token renovado com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	async refresh(@Headers() headers: RefreshToken) {
		const { authorization } = headers;
		
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
