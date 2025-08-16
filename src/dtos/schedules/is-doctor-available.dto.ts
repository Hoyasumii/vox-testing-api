import { z } from "zod";
import { uuid } from "../uuid.dto";

export const IsDoctorAvailableDTO = z.object({
	doctorId: uuid,
	targetDate: z.date(),
});

export type IsDoctorAvailableDTO = z.infer<typeof IsDoctorAvailableDTO>;
