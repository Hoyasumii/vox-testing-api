import { DeleteUserService } from "@/services/users";
import { Controller, Delete, Headers } from "@nestjs/common";
import { AuthorizationHeader } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";

@ApiTags("👥 Usuários")
@Controller()
export class DeleteUserController {
	constructor(private service: DeleteUserService) {}

	@Delete()
	@ApiOperation({ 
		summary: "Deletar conta do usuário logado",
		description: "Remove permanentemente a conta do usuário autenticado"
	})
	@ApiHeader({
		name: "authorization",
		description: "Token JWT do usuário",
		required: true
	})
	@ApiResponse({ 
		status: 200, 
		description: "Conta deletada com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	async remove(@Headers() headers: AuthorizationHeader) {
		return this.service.run(headers.authorization);
	}
}
