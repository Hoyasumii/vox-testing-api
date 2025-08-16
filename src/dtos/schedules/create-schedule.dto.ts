import { z } from "zod";
import { uuid } from "../uuid.dto";

export const CreateScheduleDTO = z.object({
	availabilityId: uuid,
	patientId: uuid,
	doctorId: uuid,
	scheduledAt: z.date(),
});

export type CreateScheduleDTO = z.infer<typeof CreateScheduleDTO>;
