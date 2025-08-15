import z from "zod";

export const UpdateDoctorAvailabilityDTO = z.object({
	dayOfWeek: z.number().int().min(0).max(6).optional(),
	startHour: z.number().min(0).max(23).optional(),
	endHour: z.number().min(0).max(23).optional(),
});

export type UpdateDoctorAvailabilityDTO = z.infer<
	typeof UpdateDoctorAvailabilityDTO
>;
