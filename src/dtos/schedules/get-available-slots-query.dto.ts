import { z } from "zod";
import { uuid } from "../uuid.dto";

export const GetAvailableSlotsQueryDTO = z.object({
	doctorId: uuid.optional().describe("ID do médico (opcional para filtrar por médico específico)"),
	date: z.string().optional().describe("Data específica para buscar slots (formato YYYY-MM-DD)"),
	startDate: z.string().optional().describe("Data inicial do período (formato YYYY-MM-DD)"),
	endDate: z.string().optional().describe("Data final do período (formato YYYY-MM-DD)")
}).refine(
	(data) => {
		// Se date está definido, startDate e endDate não devem estar
		if (data.date && (data.startDate || data.endDate)) {
			return false;
		}
		// Se startDate está definido, endDate também deve estar
		if (data.startDate && !data.endDate) {
			return false;
		}
		// Se endDate está definido, startDate também deve estar
		if (data.endDate && !data.startDate) {
			return false;
		}
		return true;
	},
	{
		message: "Use either 'date' for a specific date OR both 'startDate' and 'endDate' for a date range",
	}
).describe("Query parameters para buscar slots de horários disponíveis");

export type GetAvailableSlotsQueryDTO = z.infer<typeof GetAvailableSlotsQueryDTO>;
