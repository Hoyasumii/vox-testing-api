import { CreateScheduleService } from "@/services/schedule";
import { Controller, Post, Body } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { uuid } from "@/dtos";

// DTO customizado para o Swagger sem z.date()
const CreateScheduleBodySchema = z.object({
	availabilityId: uuid.describe("ID da disponibilidade do médico sendo agendada"),
	patientId: uuid.describe("ID do paciente que está fazendo o agendamento"),
	doctorId: uuid.describe("ID do médico para o agendamento"),
	scheduledAt: z.string().datetime().describe("Data e hora específica do agendamento (ISO format)"),
});

export class CreateScheduleBody extends createZodDto(CreateScheduleBodySchema) {}

@ApiTags("🗓️ Agendamentos")
@Controller()
export class CreateScheduleController {
	constructor(private service: CreateScheduleService) {}

	@Post()
	@ApiOperation({ 
		summary: "Criar agendamento",
		description: "Cria um novo agendamento médico (apenas pacientes)"
	})
	@ApiResponse({ 
		status: 201, 
		description: "Agendamento criado com sucesso" 
	})
	@ApiResponse({ 
		status: 400, 
		description: "Dados inválidos" 
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não tem permissão (deve ser paciente)" 
	})
	@ApiResponse({ 
		status: 409, 
		description: "Conflito de horários ou disponibilidade não encontrada" 
	})
	async create(@Body() body: CreateScheduleBody) {
		return await this.service.run({
			...body,
			scheduledAt: new Date(body.scheduledAt)
		});
	}
}
