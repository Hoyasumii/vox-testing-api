import z from "zod";

export const DoctorAvailabilityDTO = z.object({
	id: z.uuid().describe("Identificador único da disponibilidade"),
	doctorId: z.uuid().describe("ID do médico"),
	dayOfWeek: z.number().int().min(0).max(6).describe("Dia da semana (0=domingo, 6=sábado)"),
	startHour: z.number().min(0).max(23).describe("Hora de início da disponibilidade (0-23)"),
	endHour: z.number().min(0).max(23).describe("Hora de fim da disponibilidade (0-23)"),
}).describe("Dados de resposta de uma disponibilidade de horário de um médico");

export type DoctorAvailabilityDTO = z.infer<typeof DoctorAvailabilityDTO>;
