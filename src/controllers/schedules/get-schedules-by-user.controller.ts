import { GetScheduleByPatientIdService, GetScheduleByDoctorIdService } from "@/services/schedule";
import { Controller, Get, UseGuards, Request } from "@nestjs/common";
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from "@nestjs/swagger";
import { JwtAuthGuard } from "@/guards";
import type { AuthenticatedRequest } from "@/types";
import type { ScheduleResponseDTO } from "@/dtos/schedules";

@ApiTags("🗓️ Agendamentos")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller()
export class GetSchedulesByUserController {
	constructor(
		private patientService: GetScheduleByPatientIdService,
		private doctorService: GetScheduleByDoctorIdService
	) {}

	@Get()
	@ApiOperation({ 
		summary: "Listar agendamentos do usuário logado",
		description: "Retorna todos os agendamentos do usuário logado (paciente ou médico)"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Lista de agendamentos retornada com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
					description: "Indica se a operação foi bem-sucedida"
				},
				data: {
					type: "array",
					items: {
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
								enum: ["PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"],
								description: "Status do agendamento",
								example: "CONFIRMED"
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
								example: "2024-01-15T14:00:00Z"
							}
						},
						required: ["id", "status", "availabilityId", "patientId", "doctorId", "scheduledAt"]
					},
					description: "Lista de agendamentos do usuário"
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 400, 
		description: "ID de usuário inválido",
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
	async get(@Request() req: AuthenticatedRequest): Promise<Array<ScheduleResponseDTO>> {
		// Determina automaticamente se é paciente ou médico pelo token
		if (req.user.type === 'DOCTOR') {
			return await this.doctorService.run(req.user.id);
		} else {
			return await this.patientService.run(req.user.id);
		}
	}
}
