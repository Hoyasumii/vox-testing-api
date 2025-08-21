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
		description:
			"Cria uma nova conta de usuário (médico ou paciente) e retorna o ID do usuário criado",
	})
	@ApiResponse({
		status: 201,
		description: "Usuário criado com sucesso",
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
					format: "uuid",
					description: "ID único do usuário criado",
					example: "550e8400-e29b-41d4-a716-446655440000",
				},
			},
			required: ["success", "data"],
		},
	})
	@ApiResponse({
		status: 400,
		description: "Dados de entrada inválidos",
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
		status: 409,
		description: "Email já está em uso",
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
		description: "Muitas tentativas de registro",
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
	async create(@Body() body: CreateUser): Promise<string> {
		return await this.service.run(body);
	}
}
