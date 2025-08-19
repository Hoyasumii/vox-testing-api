import { z } from "zod";
import { uuid } from "../uuid.dto";

export const CreateScheduleDTO = z.object({
	availabilityId: uuid.describe("ID da disponibilidade do médico sendo agendada"),
	patientId: uuid.describe("ID do paciente que está fazendo o agendamento"),
	doctorId: uuid.describe("ID do médico para o agendamento"),
	scheduledAt: z.date().describe("Data e hora específica do agendamento"),
}).describe("Dados necessários para criar um novo agendamento médico");

export type CreateScheduleDTO = z.infer<typeof CreateScheduleDTO>;
