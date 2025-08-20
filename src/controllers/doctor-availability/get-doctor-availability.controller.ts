import { FindByDoctorIdService } from "@/services/doctors-availability";
import { Controller, Get, Param } from "@nestjs/common";
import { DoctorIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("📅 Disponibilidades")
@Controller()
export class GetDoctorAvailabilityController {
	constructor(private service: FindByDoctorIdService) {}

	@Get()
	@ApiOperation({ 
		summary: "Listar disponibilidades do médico",
		description: "Retorna todas as disponibilidades de horário do médico especificado"
	})
	@ApiParam({
		name: "doctorId",
		description: "ID do médico",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Lista de disponibilidades retornada com sucesso" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico não encontrado" 
	})
	async get(@Param() params: DoctorIdParam) {
		return await this.service.run(params.id);
	}
}
