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
		description: "Perfil de médico deletado com sucesso",
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
					description: "Confirmação da exclusão",
					example: true
				}
			},
			required: ["success", "data"]
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
				}
			}
		}
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não é um médico",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				}
			}
		}
	})
	async delete(@Headers() headers: AuthorizationHeader): Promise<boolean> {
		return await this.service.run(headers.authorization);
	}
}
