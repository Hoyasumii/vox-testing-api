import { DoctorExistsService } from "@/services/doctors";
import { Controller, Get, Param } from "@nestjs/common";
import { DoctorIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";

@ApiTags("👨‍⚕️ Médicos")
@Controller()
export class DoctorExistsController {
	constructor(private service: DoctorExistsService) {}

	@Get()
	@ApiOperation({ 
		summary: "Verificar se médico existe",
		description: "Verifica se um médico existe no sistema pelo ID"
	})
	@ApiParam({
		name: "id",
		description: "ID único do médico",
		type: "string",
		format: "uuid"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Informação sobre a existência do médico" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico não encontrado" 
	})
	async run(@Param() params: DoctorIdParam) {
		return await this.service.run(params.id);
	}
}
