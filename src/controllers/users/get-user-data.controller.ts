import { GetUserContentByIdService } from "@/services/users";
import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
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
		description: "Retorna os dados do usuário autenticado"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Dados do usuário retornados com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	async get(@Request() req: AuthenticatedRequest) {
		return await this.service.run(req.user.id);
	}
}
