import { z } from "zod";
import { uuid } from "../uuid.dto";

export const FindScheduleByIdDTO = z.object({
	scheduleId: uuid,
});

export type FindScheduleByIdDTO = z.infer<typeof FindScheduleByIdDTO>;
