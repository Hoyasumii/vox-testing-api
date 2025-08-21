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
		description: "Agendamento deletado com sucesso",
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
		status: 404, 
		description: "Agendamento não encontrado",
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
	async delete(@Param() params: ScheduleIdParam): Promise<boolean> {
		return await this.service.run(params.id);
	}
}
