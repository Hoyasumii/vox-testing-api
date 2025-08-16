import { z } from "zod";
import { uuid } from "../uuid.dto";

export const FindSchedulesByDoctorIdDTO = z.object({
	doctorId: uuid,
	page: z.number().int().positive().optional().default(1),
	limit: z.number().int().positive().max(100).optional().default(10),
	startDate: z.date().optional(),
	endDate: z.date().optional(),
});

export type FindSchedulesByDoctorIdDTO = z.infer<typeof FindSchedulesByDoctorIdDTO>;
