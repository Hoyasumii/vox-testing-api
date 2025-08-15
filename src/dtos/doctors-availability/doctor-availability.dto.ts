import z from "zod";

export const DoctorAvailabilityDTO = z.object({
	id: z.uuid(),
	doctorId: z.uuid(),
	dayOfWeek: z.number().int().min(0).max(6),
	startHour: z.number().min(0).max(23),
	endHour: z.number().min(0).max(23),
});

export type DoctorAvailabilityDTO = z.infer<typeof DoctorAvailabilityDTO>;
