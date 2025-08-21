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
		description: "Agendamento cancelado com sucesso",
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
					description: "Confirmação do cancelamento",
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
	@ApiResponse({ 
		status: 409, 
		description: "Agendamento não pode ser cancelado (já realizado ou cancelado)",
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
	async cancel(@Param() params: ScheduleIdParam): Promise<boolean> {
		return await this.service.run(params.id);
	}
}
