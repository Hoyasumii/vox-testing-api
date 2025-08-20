import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";
import { Controller, Post, Param, Body } from "@nestjs/common";
import { DoctorIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiHeader, ApiParam } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { CreateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";

export class CreateDoctorAvailabilityBody extends createZodDto(CreateDoctorAvailabilityDTO) {}

@ApiTags("📅 Disponibilidades")
@Controller()
export class CreateDoctorAvailabilityController {
	constructor(private service: CreateDoctorAvailabilityService) {}

	@Post()
	@ApiOperation({ 
		summary: "Criar disponibilidade",
		description: "Cria uma nova disponibilidade de horário para o médico"
	})
	@ApiHeader({
		name: "authorization",
		description: "Token JWT do médico",
		required: true
	})
	@ApiParam({
		name: "doctorId",
		description: "ID do médico",
		type: "string"
	})
	@ApiResponse({ 
		status: 201, 
		description: "Disponibilidade criada com sucesso" 
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não tem permissão (deve ser médico)" 
	})
	@ApiResponse({ 
		status: 409, 
		description: "Conflito de horários" 
	})
	async create(
		@Param() params: DoctorIdParam,
		@Body() body: CreateDoctorAvailabilityBody
	) {
		return await this.service.run({
			...body,
			doctorId: params.id
		});
	}
}
