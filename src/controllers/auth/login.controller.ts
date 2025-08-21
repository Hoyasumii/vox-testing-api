import { AuthenticateUserDTO } from "@/dtos/users";
import { AuthenticateUserService } from "@/services/users";
import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

export class AuthenticateUser extends createZodDto(AuthenticateUserDTO) {}

@ApiTags("🔐 Autenticação")
@Controller()
export class LoginController {
	constructor(private service: AuthenticateUserService) {}

	@Post()
	@Throttle({ short: { limit: 5, ttl: 60000 } }) // 5 tentativas por minuto
	@ApiOperation({
		summary: "Autenticar usuário",
		description:
			"Autentica um usuário (médico ou paciente) no sistema e retorna um JWT token",
	})
	@ApiResponse({
		status: 200,
		description: "Autenticação realizada com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
					description: "Indica se a operação foi bem-sucedida",
				},
				data: {
					type: "string",
					description: "JWT token para autenticação",
					example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
				},
			},
			required: ["success", "data"],
		},
	})
	@ApiResponse({
		status: 400,
		description: "Dados de entrada inválidos ou credenciais incorretas",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false,
				},
			},
		},
	})
	@ApiResponse({
		status: 429,
		description:
			"Muitas tentativas de login. Tente novamente em alguns minutos.",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false,
				},
			},
		},
	})
	async auth(@Body() body: AuthenticateUser): Promise<string> {
		return await this.service.run(body);
	}
}
