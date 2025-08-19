import { z } from "zod";

export const ScheduleStatus = z.enum(["SCHEDULED", "CANCELED", "COMPLETED"]).describe("Status atual de um agendamento: agendado, cancelado ou concluído");

export type ScheduleStatus = z.infer<typeof ScheduleStatus>;
