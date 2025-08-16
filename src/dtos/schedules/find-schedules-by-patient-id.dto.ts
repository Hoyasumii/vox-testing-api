import { z } from "zod";
import { uuid } from "../uuid.dto";

export const FindSchedulesByPatientIdDTO = z.object({
	patientId: uuid,
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().max(100).optional().default(10),
});

export type FindSchedulesByPatientIdDTO = z.infer<typeof FindSchedulesByPatientIdDTO>;
