import { z } from "zod";
import { uuid } from "../uuid.dto";

export const CancelScheduleDTO = z.object({
	scheduleId: uuid,
});

export type CancelScheduleDTO = z.infer<typeof CancelScheduleDTO>;
