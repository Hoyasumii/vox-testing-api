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
		description: "Agendamento marcado como concluído com sucesso",
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
					description: "Confirmação da conclusão",
					example: true
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não tem permissão (deve ser médico)",
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
		description: "Agendamento não pode ser concluído (já cancelado ou concluído)",
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
	async complete(@Param() params: ScheduleIdParam): Promise<boolean> {
		return await this.service.run(params.id);
	}
}
