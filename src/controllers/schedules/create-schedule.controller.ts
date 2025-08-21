import { CreateScheduleService } from "@/services/schedule";
import { Controller, Post, Body, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { createZodDto } from "nestjs-zod";
import { z } from "zod";
import { uuid } from "@/dtos";
import { JwtAuthGuard, RolesGuard, Roles } from "@/guards";
import { Throttle } from "@nestjs/throttler";
import type { AuthenticatedRequest } from "@/types";
import type { ScheduleResponseDTO } from "@/dtos/schedules";

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
		description: "Agendamento criado com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
					description: "Indica se a operação foi bem-sucedida"
				},
				data: {
					type: "object",
					properties: {
						id: {
							type: "string",
							format: "uuid",
							description: "Identificador único do agendamento",
							example: "550e8400-e29b-41d4-a716-446655440000"
						},
						status: {
							type: "string",
							enum: ["SCHEDULED", "CONFIRMED", "COMPLETED", "CANCELED"],
							description: "Status do agendamento",
							example: "SCHEDULED"
						},
						availabilityId: {
							type: "string",
							format: "uuid",
							description: "ID da disponibilidade do médico",
							example: "550e8400-e29b-41d4-a716-446655440001"
						},
						patientId: {
							type: "string",
							format: "uuid",
							description: "ID do paciente",
							example: "550e8400-e29b-41d4-a716-446655440002"
						},
						doctorId: {
							type: "string",
							format: "uuid",
							description: "ID do médico",
							example: "550e8400-e29b-41d4-a716-446655440003"
						},
						scheduledAt: {
							type: "string",
							format: "date-time",
							description: "Data e hora do agendamento",
							example: "2025-08-17T10:00:00Z"
						}
					},
					required: ["id", "status", "availabilityId", "patientId", "doctorId", "scheduledAt"]
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 400, 
		description: "Dados inválidos",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 401, 
		description: "Token inválido ou expirado",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 403, 
		description: "Usuário não tem permissão (deve ser paciente)",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 429, 
		description: "Muitas tentativas de agendamento. Aguarde um momento.",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	@ApiResponse({ 
		status: 409, 
		description: "Conflito de horários ou disponibilidade não encontrada",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				},
			}
		}
	})
	async create(
		@Request() req: AuthenticatedRequest,
		@Body() body: CreateScheduleBody
	): Promise<ScheduleResponseDTO> {
		return await this.service.run({
			...body,
			patientId: req.user.id, // Usar automaticamente o ID do paciente logado
			scheduledAt: new Date(body.scheduledAt)
		});
	}
}
