import { CancelScheduleService } from "@/services/schedule";
import { Controller, Put, Param } from "@nestjs/common";
import { ScheduleIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("🗓️ Agendamentos")
@Controller()
export class CancelScheduleController {
	constructor(private service: CancelScheduleService) {}

	@Put()
	@ApiOperation({ 
		summary: "Cancelar agendamento",
		description: "Cancela um agendamento específico"
	})
	@ApiParam({
		name: "id",
		description: "ID do agendamento",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Agendamento cancelado com sucesso" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Agendamento não encontrado" 
	})
	@ApiResponse({ 
		status: 409, 
		description: "Agendamento não pode ser cancelado (já realizado ou cancelado)" 
	})
	async cancel(@Param() params: ScheduleIdParam) {
		return await this.service.run(params.id);
	}
}
