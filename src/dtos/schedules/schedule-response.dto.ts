import { z } from "zod";
import { uuid } from "../uuid.dto";
import { ScheduleStatus } from "./schedule-types";

export const ScheduleResponseDTO = z.object({
	id: uuid.describe("Identificador único do agendamento"),
	status: ScheduleStatus,
	availabilityId: uuid.describe("ID da disponibilidade do médico"),
	patientId: uuid.describe("ID do paciente"),
	doctorId: uuid.describe("ID do médico"),
	scheduledAt: z.date().describe("Data e hora do agendamento")
}).describe("Dados de resposta de um agendamento médico");

export type ScheduleResponseDTO = z.infer<typeof ScheduleResponseDTO>;
