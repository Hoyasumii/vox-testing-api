import { GetAvailableSlotsSerice } from "@/services/schedule";
import { Controller, Get, Query } from "@nestjs/common";
import { GetAvailableSlotsQuery } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";
import type { AvailableSlotResponseDTO } from "@/dtos/schedules";

@ApiTags("🔍 Busca de Horários")
@Controller()
export class GetAvailableSlotsController {
	constructor(private service: GetAvailableSlotsSerice) {}

	@Get()
	@ApiOperation({
		summary: "Buscar slots disponíveis",
		description:
			"Busca horários disponíveis para agendamento com filtros opcionais",
	})
	@ApiQuery({
		name: "doctorId",
		description: "ID do médico (opcional)",
		required: false,
		type: "string",
	})
	@ApiQuery({
		name: "date",
		description: "Data específica (formato YYYY-MM-DD, opcional)",
		required: false,
		type: "string",
	})
	@ApiQuery({
		name: "startDate",
		description: "Data inicial do período (formato YYYY-MM-DD, opcional)",
		required: false,
		type: "string",
	})
	@ApiQuery({
		name: "endDate",
		description: "Data final do período (formato YYYY-MM-DD, opcional)",
		required: false,
		type: "string",
	})
	@ApiResponse({
		status: 200,
		description: "Lista de slots disponíveis retornada com sucesso",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: true,
				},
				data: {
					type: "array",
					items: {
						type: "object",
						properties: {
							availabilityId: {
								type: "string",
								format: "uuid",
								description: "ID da disponibilidade do médico",
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
								example: 9
							},
							endHour: {
								type: "number",
								minimum: 0,
								maximum: 23,
								description: "Hora de fim da disponibilidade (0-23)",
								example: 17
							},
							availableDate: {
								type: "string",
								format: "date-time",
								description: "Data específica disponível para agendamento",
								example: "2025-08-17T00:00:00Z"
							},
							isAvailable: {
								type: "boolean",
								description: "Indica se o horário está disponível para agendamento",
								example: true
							}
						},
						required: ["availabilityId", "doctorId", "dayOfWeek", "startHour", "endHour", "availableDate", "isAvailable"]
					}
				}
			},
			required: ["success", "data"]
		}
	})
	@ApiResponse({
		status: 400,
		description: "Parâmetros de query inválidos",
		schema: {
			type: "object",
			properties: {
				success: {
					type: "boolean",
					example: false,
				},
			},
		},
	})
	async get(@Query() query: GetAvailableSlotsQuery): Promise<Array<AvailableSlotResponseDTO>> {
		// Se não especificar doctorId, retorna erro
		if (!query.doctorId) {
			throw new Error("doctorId is required");
		}

		const startDate = query.date
			? new Date(query.date)
			: query.startDate
				? new Date(query.startDate)
				: new Date();

		const endDate = query.date
			? new Date(query.date)
			: query.endDate
				? new Date(query.endDate)
				: new Date();

		return await this.service.run({
			doctorId: query.doctorId,
			startDate,
			endDate,
		});
	}
}
