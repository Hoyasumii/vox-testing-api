import { CreateUserDTO } from "@/dtos/users";
import { CreateUserService } from "@/services/users";
import { Body, Controller, Post } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { Throttle } from "@nestjs/throttler";

export class CreateUser extends createZodDto(CreateUserDTO) {}

@ApiTags("🔐 Autenticação")
@Controller()
export class RegisterController {
	constructor(private service: CreateUserService) {}

	@Post()
	@Throttle({ short: { limit: 3, ttl: 300000 } }) // 3 tentativas por 5 minutos
	@ApiOperation({ 
		summary: "Registrar novo usuário",
		description: "Cria uma nova conta de usuário (médico ou paciente)"
	})
	@ApiResponse({ 
		status: 201, 
		description: "Usuário criado com sucesso" 
	})
	@ApiResponse({ 
		status: 409, 
		description: "Email já está em uso" 
	})
	@ApiResponse({ 
		status: 429, 
		description: "Muitas tentativas de registro. Tente novamente em alguns minutos." 
	})
	async create(@Body() body: CreateUser) {
		return await this.service.run(body);
	}
}
