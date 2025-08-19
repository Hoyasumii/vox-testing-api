import { z } from "zod";
import { uuid } from "../uuid.dto";

export const AvailableSlotResponseDTO = z.object({
	availabilityId: uuid.describe("ID da disponibilidade do médico"),
	doctorId: uuid.describe("ID do médico"),
	dayOfWeek: z.number().int().min(0).max(6).describe("Dia da semana (0=domingo, 6=sábado)"),
	startHour: z.number().int().min(0).max(23).describe("Hora de início da disponibilidade (0-23)"),
	endHour: z.number().int().min(0).max(23).describe("Hora de fim da disponibilidade (0-23)"),
	availableDate: z.date().describe("Data específica disponível para agendamento"),
	isAvailable: z.boolean().describe("Indica se o horário está disponível para agendamento"),
}).describe("Dados de resposta de um slot de horário disponível para agendamento");

export type AvailableSlotResponseDTO = z.infer<typeof AvailableSlotResponseDTO>;
