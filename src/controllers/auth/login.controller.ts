import { AuthenticateUserDTO } from "@/dtos/users";
import { AuthenticateUserService } from "@/services/users";
import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";

export class AuthenticateUser extends createZodDto(AuthenticateUserDTO) {}

@ApiTags("🔐 Autenticação")
@Controller()
export class LoginController {
	constructor(private service: AuthenticateUserService) {}

	@Post()
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
	async auth(@Body() body: AuthenticateUser) {
		return await this.service.run(body);
	}
}
