import z from "zod";

export const CreateDoctorAvailabilityDTO = z.object({
	doctorId: z.uuid(),
	dayOfWeek: z.number().int().min(0).max(6),
	startHour: z.number().min(0).max(22),
	endHour: z.number().min(0).max(23),
}).refine((data) => data.endHour > data.startHour, {
	message: "End hour must be greater than start hour",
	path: ["endHour"]
});

export type CreateDoctorAvailabilityDTO = z.infer<
	typeof CreateDoctorAvailabilityDTO
>;
