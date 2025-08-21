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
import { Throttle } from "@nestjs/throttler";

@ApiTags("🔐 Autenticação")
@Controller()
export class RefreshTokenController {
	constructor(
		private verifyJwtToken: VerifyJwtToken,
		private refreshJwtToken: RefreshJwtToken,
	) {}

	@Post()
	@Throttle({ medium: { limit: 10, ttl: 60000 } }) // 10 renovações por minuto
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
		description: "Token renovado com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
					description: "Indica se a operação foi bem-sucedida"
				},
				data: {
					type: "string",
					description: "Novo JWT token renovado",
					example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 400, 
		description: "Token de autorização não fornecido",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 429, 
		description: "Muitas tentativas de renovação de token",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	async refresh(@Headers() headers: RefreshToken): Promise<string> {
		const { authorization } = headers;
		
		if (!authorization || authorization.trim() === "") {
			throw new BadRequestException("Token de autorização é obrigatório");
		}

		try {
			await this.verifyJwtToken.run(authorization);

			const newToken = await this.refreshJwtToken.run(authorization);

			return newToken; // Retorna apenas o token, interceptor cuidará da padronização
		} catch {
			throw new UnauthorizedException("Token inválido ou expirado");
		}
	}
}
