import { DeleteUserService } from "@/services/users";
import { Controller, Delete, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/guards";
import type { AuthenticatedRequest } from "@/types";

@ApiTags("👥 Usuários")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class DeleteUserController {
	constructor(private service: DeleteUserService) {}

	@Delete()
	@ApiOperation({ 
		summary: "Deletar conta do usuário logado",
		description: "Remove permanentemente a conta do usuário autenticado"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Conta deletada com sucesso",
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
					description: "Resultado da operação de exclusão"
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 400, 
		description: "ID de usuário inválido",
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
	async remove(@Request() req: AuthenticatedRequest): Promise<boolean> {
		return this.service.run(req.user.id);
	}
}
