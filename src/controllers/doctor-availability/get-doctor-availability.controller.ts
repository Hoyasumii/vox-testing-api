import { FindByDoctorIdService } from "@/services/doctors-availability";
import { Controller, Get, Param } from "@nestjs/common";
import { DoctorIdParam } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from "@nestjs/swagger";
import type { DoctorAvailabilityDTO } from "@/dtos/doctors-availability";

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
		description: "Lista de disponibilidades retornada com sucesso",
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
								description: "Identificador único da disponibilidade",
								example: "550e8400-e29b-41d4-a716-446655440000"
							},
							doctorId: {
								type: "string",
								format: "uuid",
								description: "ID do médico",
								example: "550e8400-e29b-41d4-a716-446655440001"
							},
							dayOfWeek: {
								type: "number",
								minimum: 0,
								maximum: 6,
								description: "Dia da semana (0=domingo, 6=sábado)",
								example: 1
							},
							startHour: {
								type: "number",
								minimum: 0,
								maximum: 23,
								description: "Hora de início da disponibilidade (0-23)",
								example: 8
							},
							endHour: {
								type: "number",
								minimum: 0,
								maximum: 23,
								description: "Hora de fim da disponibilidade (0-23)",
								example: 17
							}
						},
						required: ["id", "doctorId", "dayOfWeek", "startHour", "endHour"]
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
				},
			}
		}
	})
	async get(@Param() params: DoctorIdParam): Promise<Array<DoctorAvailabilityDTO>> {
		return await this.service.run(params.id);
	}
}
