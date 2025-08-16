import { z } from "zod";
import { uuid } from "../uuid.dto";

export const DeleteScheduleDTO = z.object({
	scheduleId: uuid,
});

export type DeleteScheduleDTO = z.infer<typeof DeleteScheduleDTO>;
