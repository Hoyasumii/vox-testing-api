import { DeleteDoctorAvailabilityByIdService } from "@/services/doctors-availability";
import { Controller, Delete, Param } from "@nestjs/common";
import { DoctorAvailabilityIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("📅 Disponibilidades")
@Controller()
export class DeleteDoctorAvailabilityByIdController {
	constructor(private service: DeleteDoctorAvailabilityByIdService) {}

	@Delete()
	@ApiOperation({ 
		summary: "Deletar disponibilidade específica",
		description: "Remove uma disponibilidade específica do médico"
	})
	@ApiParam({
		name: "doctorId",
		description: "ID do médico",
		type: "string"
	})
	@ApiParam({
		name: "id",
		description: "ID da disponibilidade",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Disponibilidade deletada com sucesso",
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
		description: "Disponibilidade não encontrada",
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
	async delete(@Param("id") availabilityIdParam: DoctorAvailabilityIdParam): Promise<boolean> {
		return await this.service.run(availabilityIdParam.id);
	}
}
