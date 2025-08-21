import { GetScheduleByDoctorIdService } from "@/services/schedule";
import { Controller, Get, Param } from "@nestjs/common";
import { DoctorIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import type { ScheduleResponseDTO } from "@/dtos/schedules";

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
		description: "Lista de agendamentos do médico retornada com sucesso",
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
								enum: ["SCHEDULED", "CANCELED", "COMPLETED"],
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
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({ 
		status: 404, 
		description: "Médico não encontrado",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false
				}
			}
		}
	})
	async get(@Param() params: DoctorIdParam): Promise<Array<ScheduleResponseDTO>> {
		return await this.service.run(params.id);
	}
}
