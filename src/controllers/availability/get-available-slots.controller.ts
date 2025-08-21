import { GetAvailableSlotsSerice } from "@/services/schedule";
import { Controller, Get, Query } from "@nestjs/common";
import { GetAvailableSlotsQuery } from "../common-dtos";
import { ApiTags, ApiOperation, ApiResponse, ApiQuery } from "@nestjs/swagger";

@ApiTags("🔍 Busca de Horários")
@Controller()
export class GetAvailableSlotsController {
	constructor(private service: GetAvailableSlotsSerice) {}

	@Get()
	@ApiOperation({ 
		summary: "Buscar slots disponíveis",
		description: "Busca horários disponíveis para agendamento com filtros opcionais"
	})
	@ApiQuery({
		name: "doctorId",
		description: "ID do médico (opcional)",
		required: false,
		type: "string"
	})
	@ApiQuery({
		name: "date",
		description: "Data específica (formato YYYY-MM-DD, opcional)",
		required: false,
		type: "string"
	})
	@ApiQuery({
		name: "startDate",
		description: "Data inicial do período (formato YYYY-MM-DD, opcional)",
		required: false,
		type: "string"
	})
	@ApiQuery({
		name: "endDate",
		description: "Data final do período (formato YYYY-MM-DD, opcional)",
		required: false,
		type: "string"
	})
	@ApiResponse({ 
		status: 200, 
		description: "Lista de slots disponíveis retornada com sucesso" 
	})
	@ApiResponse({ 
		status: 400, 
		description: "Parâmetros de query inválidos" 
	})
	async get(@Query() query: GetAvailableSlotsQuery) {
		// Se não especificar doctorId, retorna erro
		if (!query.doctorId) {
			throw new Error("doctorId is required");
		}

		const startDate = query.date ? new Date(query.date) : 
			query.startDate ? new Date(query.startDate) : new Date();
		
		const endDate = query.date ? new Date(query.date) : 
			query.endDate ? new Date(query.endDate) : new Date();

		return await this.service.run({
			doctorId: query.doctorId,
			startDate,
			endDate
		});
	}
}
