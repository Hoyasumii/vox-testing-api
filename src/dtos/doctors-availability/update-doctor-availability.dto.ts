import z from "zod";

export const UpdateDoctorAvailabilityDTO = z.object({
	dayOfWeek: z.number().int().min(0).max(6).optional().describe("Dia da semana (0=domingo, 6=sábado)"),
	startHour: z.number().min(0).max(22).optional().describe("Hora de início da disponibilidade (0-22)"),
	endHour: z.number().min(0).max(23).optional().describe("Hora de fim da disponibilidade (0-23)"),
}).refine((data) => {
	if (data.startHour !== undefined && data.endHour !== undefined) {
		return data.endHour > data.startHour;
	}
	return true;
}, {
	message: "End hour must be greater than start hour",
	path: ["endHour"]
}).describe("Dados opcionais para atualizar uma disponibilidade de horário existente de um médico");

export type UpdateDoctorAvailabilityDTO = z.infer<
	typeof UpdateDoctorAvailabilityDTO
>;
