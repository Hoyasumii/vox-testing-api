import { GetUserContentByIdService } from "@/services/users";
import { Controller, Get, Headers } from "@nestjs/common";
import { AuthorizationHeader } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";

@ApiTags("👥 Usuários")
@Controller()
export class GetUserDataController {
	constructor(private service: GetUserContentByIdService) {}

	@Get()
	@ApiOperation({ 
		summary: "Obter dados do usuário logado",
		description: "Retorna os dados do usuário autenticado"
	})
	@ApiHeader({
		name: "authorization",
		description: "Token JWT do usuário",
		required: true
	})
	@ApiResponse({ 
		status: 200, 
		description: "Dados do usuário retornados com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	async get(@Headers() headers: AuthorizationHeader) {
		return await this.service.run(headers.authorization);
	}
}
