import { z } from "zod";
import { uuid } from "../uuid.dto";

export const ScheduleIdParamDTO = z.object({
	id: uuid.describe("ID do agendamento"),
}).describe("Parâmetro de rota para identificar um agendamento específico");

export type ScheduleIdParamDTO = z.infer<typeof ScheduleIdParamDTO>;
