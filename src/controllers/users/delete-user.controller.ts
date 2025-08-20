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
		description: "Conta deletada com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	async remove(@Request() req: AuthenticatedRequest) {
		return this.service.run(req.user.id);
	}
}
