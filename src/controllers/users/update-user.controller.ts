import { UpdateUserDTO } from "@/dtos/users";
import { UpdateUserService } from "@/services/users";
import { Body, Controller, Headers, Put } from "@nestjs/common";
import { createZodDto } from "nestjs-zod";
import { AuthorizationHeader } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";

export class UpdateUser extends createZodDto(UpdateUserDTO) {}

@ApiTags("👥 Usuários")
@Controller()
export class UpdateUserController {
	constructor(private service: UpdateUserService) {}

	@Put()
	@ApiOperation({ 
		summary: "Atualizar dados do usuário logado",
		description: "Atualiza as informações do usuário autenticado"
	})
	@ApiHeader({
		name: "authorization",
		description: "Token JWT do usuário",
		required: true
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
		@Headers() headers: AuthorizationHeader,
		@Body() data: UpdateUser,
	) {
		return await this.service.run({ id: headers.authorization, data });
	}
}
