import { GetUserContentByIdService } from "@/services/users";
import { UserResponseDTO } from "@/dtos/users";
import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import {
	ApiTags,
	ApiOperation,
	ApiResponse,
	ApiBearerAuth,
} from "@nestjs/swagger";
import { JwtAuthGuard } from "@/guards";
import type { AuthenticatedRequest } from "@/types";

@ApiTags("👥 Usuários")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class GetUserDataController {
	constructor(private service: GetUserContentByIdService) {}

	@Get()
	@ApiOperation({
		summary: "Obter dados do usuário logado",
		description:
			"Retorna os dados do usuário autenticado, excluindo informações sensíveis",
	})
	@ApiResponse({
		status: 200,
		description: "Dados do usuário retornados com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
					description: "Indica se a operação foi bem-sucedida",
				},
				data: {
					type: "object",
					properties: {
						id: {
							type: "string",
							format: "uuid",
							description: "Identificador único do usuário",
							example: "550e8400-e29b-41d4-a716-446655440000",
						},
						name: {
							type: "string",
							description: "Nome completo do usuário",
							example: "João Silva",
						},
						email: {
							type: "string",
							format: "email",
							description: "Endereço de email do usuário",
							example: "joao.silva@email.com",
						},
						type: {
							type: "string",
							enum: ["DOCTOR", "PATIENT"],
							description: "Tipo de usuário",
							example: "PATIENT",
						},
						createdAt: {
							type: "string",
							format: "date-time",
							description: "Data e hora de criação do usuário",
							example: "2024-01-15T10:30:00Z",
						},
						updatedAt: {
							type: "string",
							format: "date-time",
							description: "Data e hora da última atualização do usuário",
							example: "2024-01-15T10:30:00Z",
						},
					},
					required: ["id", "name", "email", "type", "createdAt", "updatedAt"],
				},
			},
			required: ["success", "data"],
		},
	})
	@ApiResponse({
		status: 400,
		description: "ID de usuário inválido",
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
		status: 401,
		description: "Token inválido ou expirado",
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
		status: 404,
		description: "Usuário não encontrado",
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
	async get(@Request() req: AuthenticatedRequest): Promise<UserResponseDTO> {
		return await this.service.run(req.user.id);
	}
}
