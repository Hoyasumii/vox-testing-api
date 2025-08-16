import { z } from "zod";
import { uuid } from "../uuid.dto";
import { ScheduleStatus } from "./schedule-types";

export const ScheduleResponseDTO = z.object({
	id: uuid,
	status: ScheduleStatus,
	availabilityId: uuid,
	patientId: uuid,
	doctorId: uuid,
	scheduledAt: z.date()
});

export type ScheduleResponseDTO = z.infer<typeof ScheduleResponseDTO>;
