import { CreateScheduleDTO, ScheduleResponseDTO } from "@/dtos/schedules";
import type { ScheduleRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class CreateScheduleService extends Service<
	ScheduleRepositoryBase,
	CreateScheduleDTO,
	ScheduleResponseDTO
> {
	async run(data: CreateScheduleDTO): Promise<ScheduleResponseDTO> {
		const { success } = CreateScheduleDTO.safeParse(data);

		if (!success) return this.repository.errors.badRequest();

		const isDoctorAvailableExists = await this.repository.channel.talk(
			"doctor-availability:exists",
			data.availabilityId,
		);

		if (!isDoctorAvailableExists) return this.repository.errors.notFound();

		const isDoctorAvailable = await this.repository.isDoctorAvailable(
			data.doctorId,
			data.scheduledAt,
		);

		if (!isDoctorAvailable) return this.repository.errors.conflict();

		const existingPatientSchedule = await this.repository.findByPatientId(
			data.patientId,
		);
		const hasConflict = existingPatientSchedule.some(
			(schedule) =>
				schedule.scheduledAt.getTime() === data.scheduledAt.getTime() &&
				schedule.status !== "CANCELED",
		);

		if (hasConflict) return this.repository.errors.conflict();

		return await this.repository.create(data);
	}
}
