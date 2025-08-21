import { UpdateUserDTO } from "@/dtos/users";
import { UpdateUserService } from "@/services/users";
import { Body, Controller, Put, UseGuards, Request } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/guards";
import type { AuthenticatedRequest } from "@/types";

export class UpdateUser extends createZodDto(UpdateUserDTO) {}

@ApiTags("👥 Usuários")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class UpdateUserController {
	constructor(private service: UpdateUserService) {}

	@Put()
	@ApiOperation({ 
		summary: "Atualizar dados do usuário logado",
		description: "Atualiza as informações do usuário autenticado"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Dados do usuário atualizados com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
					description: "Indica se a operação foi bem-sucedida"
				},
				data: {
					type: "boolean",
					example: true,
					description: "Resultado da operação de atualização"
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 400, 
		description: "Dados de entrada inválidos",
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
	async update(
		@Request() req: AuthenticatedRequest,
		@Body() data: UpdateUser,
	): Promise<boolean> {
		return await this.service.run({ id: req.user.id, data });
	}
}
