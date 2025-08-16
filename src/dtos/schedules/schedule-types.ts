import { z } from "zod";

export const ScheduleStatus = z.enum(["SCHEDULED", "CANCELED", "COMPLETED"]);

export type ScheduleStatus = z.infer<typeof ScheduleStatus>;
