import { z } from "zod";
import { uuid } from "../uuid.dto";

export const GetAvailableSlotsDTO = z.object({
	doctorId: uuid,
	startDate: z.date(),
	endDate: z.date(),
});

export type GetAvailableSlotsDTO = z.infer<typeof GetAvailableSlotsDTO>;
