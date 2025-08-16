import { z } from "zod";
import { uuid } from "../uuid.dto";

export const CompleteScheduleDTO = z.object({
	scheduleId: uuid,
});

export type CompleteScheduleDTO = z.infer<typeof CompleteScheduleDTO>;
