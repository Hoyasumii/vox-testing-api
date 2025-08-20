import { GetScheduleByIdService } from "@/services/schedule";
import { Controller, Get, Param } from "@nestjs/common";
import { ScheduleIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("🗓️ Agendamentos")
@Controller()
export class GetScheduleByIdController {
	constructor(private service: GetScheduleByIdService) {}

	@Get()
	@ApiOperation({ 
		summary: "Obter agendamento por ID",
		description: "Retorna os detalhes de um agendamento específico"
	})
	@ApiParam({
		name: "id",
		description: "ID do agendamento",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Agendamento retornado com sucesso" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Agendamento não encontrado" 
	})
	async get(@Param() params: ScheduleIdParam) {
		return await this.service.run(params.id);
	}
}
