import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";
import { Controller, Delete, Param } from "@nestjs/common";
import { DoctorIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("📅 Disponibilidades")
@Controller()
export class DeleteDoctorAvailabilityByDoctorIdController {
	constructor(private service: DeleteDoctorAvailabilityByDoctorIdService) {}

	@Delete()
	@ApiOperation({ 
		summary: "Deletar todas disponibilidades do médico",
		description: "Remove todas as disponibilidades de horário do médico"
	})
	@ApiParam({
		name: "doctorId",
		description: "ID do médico",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Disponibilidades deletadas com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
					description: "Indica se a operação foi bem-sucedida"
				},
				data: {
					type: "number",
					description: "Número de disponibilidades deletadas",
					example: 5
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico não encontrado",
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
	async delete(@Param() params: DoctorIdParam): Promise<number> {
		return await this.service.run(params.id);
	}
}
