import { GetScheduleByPatientIdService } from "@/services/schedule";
import { Controller, Get, Headers } from "@nestjs/common";
import { AuthorizationHeader } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader } from "@nestjs/swagger";

@ApiTags("🗓️ Agendamentos")
@Controller()
export class GetSchedulesByUserController {
	constructor(private service: GetScheduleByPatientIdService) {}

	@Get()
	@ApiOperation({ 
		summary: "Listar agendamentos do usuário logado",
		description: "Retorna todos os agendamentos do usuário logado (paciente ou médico)"
	})
	@ApiHeader({
		name: "authorization",
		description: "Token JWT do usuário",
		required: true
	})
	@ApiResponse({ 
		status: 200, 
		description: "Lista de agendamentos retornada com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	async get(@Headers() headers: AuthorizationHeader) {
		// TODO: Determinar se é paciente ou médico pelo token e usar o serviço apropriado
		return await this.service.run(headers.authorization);
	}
}
