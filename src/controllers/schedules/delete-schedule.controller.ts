import { DeleteScheduleService } from "@/services/schedule";
import { Controller, Delete, Param } from "@nestjs/common";
import { ScheduleIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("🗓️ Agendamentos")
@Controller()
export class DeleteScheduleController {
	constructor(private service: DeleteScheduleService) {}

	@Delete()
	@ApiOperation({ 
		summary: "Deletar agendamento",
		description: "Remove um agendamento do sistema"
	})
	@ApiParam({
		name: "id",
		description: "ID do agendamento",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Agendamento deletado com sucesso" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Agendamento não encontrado" 
	})
	async delete(@Param() params: ScheduleIdParam) {
		return await this.service.run(params.id);
	}
}
