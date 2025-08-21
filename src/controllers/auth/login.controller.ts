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
		description: "Autentica um usuário (médico ou paciente) no sistema"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Autenticação realizada com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Credenciais inválidas" 
	})
	@ApiResponse({ 
		status: 429, 
		description: "Muitas tentativas de login. Tente novamente em alguns minutos." 
	})
	async auth(@Body() body: AuthenticateUser) {
		return await this.service.run(body);
	}
}
