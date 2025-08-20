import { CompleteScheduleService } from "@/services/schedule";
import { Controller, Put, Param } from "@nestjs/common";
import { ScheduleIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("🗓️ Agendamentos")
@Controller()
export class CompleteScheduleController {
	constructor(private service: CompleteScheduleService) {}

	@Put()
	@ApiOperation({ 
		summary: "Marcar agendamento como concluído",
		description: "Marca um agendamento como concluído (apenas médicos)"
	})
	@ApiParam({
		name: "id",
		description: "ID do agendamento",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Agendamento marcado como concluído com sucesso" 
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não tem permissão (deve ser médico)" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Agendamento não encontrado" 
	})
	@ApiResponse({ 
		status: 409, 
		description: "Agendamento não pode ser concluído (já cancelado ou concluído)" 
	})
	async complete(@Param() params: ScheduleIdParam) {
		return await this.service.run(params.id);
	}
}
