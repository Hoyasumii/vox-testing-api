import z from "zod";

export const CreateDoctorAvailabilityDTO = z.object({
	doctorId: z.uuid(),
	dayOfWeek: z.number().int().min(0).max(6),
	startHour: z.number().min(0).max(23),
	endHour: z.number().min(0).max(23),
});

export type CreateDoctorAvailabilityDTO = z.infer<
	typeof CreateDoctorAvailabilityDTO
>;
