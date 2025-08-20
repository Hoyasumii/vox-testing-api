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
		description: "Dados do usuário atualizados com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	async update(
		@Request() req: AuthenticatedRequest,
		@Body() data: UpdateUser,
	) {
		return await this.service.run({ id: req.user.id, data });
	}
}
