import z from "zod";

export const UpdateDoctorAvailabilityDTO = z.object({
	dayOfWeek: z.number().int().min(0).max(6).optional(),
	startHour: z.number().min(0).max(22).optional(),
	endHour: z.number().min(0).max(23).optional(),
}).refine((data) => {
	// Only validate if both startHour and endHour are provided
	if (data.startHour !== undefined && data.endHour !== undefined) {
		return data.endHour > data.startHour;
	}
	return true;
}, {
	message: "End hour must be greater than start hour",
	path: ["endHour"]
});

export type UpdateDoctorAvailabilityDTO = z.infer<
	typeof UpdateDoctorAvailabilityDTO
>;
