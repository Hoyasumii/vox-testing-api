import { CreateScheduleService } from "@/services/schedule";
import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { uuid } from "@/dtos";
import { JwtAuthGuard, RolesGuard, Roles } from "@/guards";
import { Throttle } from "@nestjs/throttler";
import type { AuthenticatedRequest } from "@/types";

// DTO customizado para o Swagger sem z.date()
const CreateScheduleBodySchema = z.object({
	availabilityId: uuid.describe("ID da disponibilidade do médico sendo agendada"),
	doctorId: uuid.describe("ID do médico para o agendamento"),
	scheduledAt: z.string().datetime().describe("Data e hora específica do agendamento (ISO format)"),
});

export class CreateScheduleBody extends createZodDto(CreateScheduleBodySchema) {}

@ApiTags("🗓️ Agendamentos")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('PATIENT')
@Controller()
export class CreateScheduleController {
	constructor(private service: CreateScheduleService) {}

	@Post()
	@Throttle({ medium: { limit: 20, ttl: 60000 } }) // 20 agendamentos por minuto
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
		status: 401, 
		description: "Token inválido ou expirado" 
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não tem permissão (deve ser paciente)" 
	})
	@ApiResponse({ 
		status: 429, 
		description: "Muitas tentativas de agendamento. Aguarde um momento." 
	})
	@ApiResponse({ 
		status: 409, 
		description: "Conflito de horários ou disponibilidade não encontrada" 
	})
	async create(
		@Request() req: AuthenticatedRequest,
		@Body() body: CreateScheduleBody
	) {
		return await this.service.run({
			...body,
			patientId: req.user.id, // Usar automaticamente o ID do paciente logado
			scheduledAt: new Date(body.scheduledAt)
		});
	}
}
