import { z } from "zod";
import { uuid } from "../uuid.dto";

export const AvailableSlotResponseDTO = z.object({
	availabilityId: uuid,
	doctorId: uuid,
	dayOfWeek: z.number().int().min(0).max(6),
	startHour: z.number().int().min(0).max(23),
	endHour: z.number().int().min(0).max(23),
	availableDate: z.date(),
	isAvailable: z.boolean(),
});

export type AvailableSlotResponseDTO = z.infer<typeof AvailableSlotResponseDTO>;
