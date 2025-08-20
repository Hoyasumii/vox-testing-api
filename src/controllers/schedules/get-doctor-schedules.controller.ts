import { GetScheduleByDoctorIdService } from "@/services/schedule";
import { Controller, Get, Param } from "@nestjs/common";
import { DoctorIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("📊 Relatórios")
@Controller()
export class GetDoctorSchedulesController {
	constructor(private service: GetScheduleByDoctorIdService) {}

	@Get()
	@ApiOperation({ 
		summary: "Agendamentos do médico",
		description: "Retorna todos os agendamentos de um médico específico"
	})
	@ApiParam({
		name: "doctorId",
		description: "ID do médico",
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Lista de agendamentos do médico retornada com sucesso" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico não encontrado" 
	})
	async get(@Param() params: DoctorIdParam) {
		return await this.service.run(params.id);
	}
}
