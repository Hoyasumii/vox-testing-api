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
		description: "Disponibilidades deletadas com sucesso" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico não encontrado" 
	})
	async delete(@Param() params: DoctorIdParam) {
		return await this.service.run(params.id);
	}
}
