import z from "zod";

export const CreateDoctorAvailabilityDTO = z.object({
	doctorId: z.uuid().describe("ID do médico"),
	dayOfWeek: z.number().int().min(0).max(6).describe("Dia da semana (0=domingo, 6=sábado)"),
	startHour: z.number().min(0).max(22).describe("Hora de início da disponibilidade (0-22)"),
	endHour: z.number().min(0).max(23).describe("Hora de fim da disponibilidade (0-23)"),
}).refine((data) => data.endHour > data.startHour, {
	message: "End hour must be greater than start hour",
	path: ["endHour"]
}).describe("Dados necessários para criar uma nova disponibilidade de horário de um médico");

export type CreateDoctorAvailabilityDTO = z.infer<
	typeof CreateDoctorAvailabilityDTO
>;
