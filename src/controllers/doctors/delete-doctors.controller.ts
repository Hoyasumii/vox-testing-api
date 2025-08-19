import { DeleteDoctorService } from "@/services/doctors";
import { Controller, Delete, Headers } from "@nestjs/common";
import { AuthorizationHeader } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";

@ApiTags("👨‍⚕️ Médicos")
@Controller()
export class DeleteDoctorsController {
	constructor(private service: DeleteDoctorService) {}

	@Delete()
	@ApiOperation({ 
		summary: "Deletar perfil de médico",
		description: "Remove o perfil de médico do usuário autenticado"
	})
	@ApiHeader({
		name: "authorization",
		description: "Token JWT do médico",
		required: true
	})
	@ApiResponse({ 
		status: 200, 
		description: "Perfil de médico deletado com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não é um médico" 
	})
	async delete(@Headers() headers: AuthorizationHeader) {
		return await this.service.run(headers.authorization);
	}
}
