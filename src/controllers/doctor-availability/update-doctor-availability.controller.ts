import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";
import { Controller, Put, Param, Body } from "@nestjs/common";
import { DoctorAvailabilityIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { UpdateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";

export class UpdateDoctorAvailabilityBody extends createZodDto(UpdateDoctorAvailabilityDTO) {}

@ApiTags("📅 Disponibilidades")
@Controller()
export class UpdateDoctorAvailabilityController {
	constructor(private service: UpdateDoctorAvailabilityService) {}

	@Put()
	@ApiOperation({ 
		summary: "Atualizar disponibilidade",
		description: "Atualiza uma disponibilidade específica do médico"
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
		description: "Disponibilidade atualizada com sucesso" 
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico ou disponibilidade não encontrada" 
	})
	@ApiResponse({ 
		status: 409, 
		description: "Conflito de horários" 
	})
	async update(
		@Param("id") availabilityIdParam: DoctorAvailabilityIdParam,
		@Body() body: UpdateDoctorAvailabilityBody
	) {
		return await this.service.run({
			id: availabilityIdParam.id,
			content: body
		});
	}
}
