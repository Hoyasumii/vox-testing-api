import type { uuid } from "@/dtos";
import type {
	AvailableSlotResponseDTO,
	CreateScheduleDTO,
	ScheduleResponseDTO,
} from "@/dtos/schedules";
import { RepositoryBase } from "@/types";

export abstract class ScheduleRepositoryBase extends RepositoryBase {
	// TODO: Ver se o patientId existe
	// TODO: Ver se o doctorId existe
	// TODO: Ver se o availabilityId existe
	// TODO: Ver se doctorId tem disponibilidade(com base no scheduledAt)
	// TODO: Ver se o patientId tem disponibilidade(com base no scheduledAt)
	abstract create(data: CreateScheduleDTO): Promise<ScheduleResponseDTO>;
	abstract findById(scheduleId: uuid): Promise<ScheduleResponseDTO | null>;
	abstract findByPatientId(
		patientId: uuid,
	): Promise<Array<ScheduleResponseDTO>>;
	abstract findByDoctorId(doctorId: uuid): Promise<Array<ScheduleResponseDTO>>;
	abstract delete(sheduleId: uuid): Promise<boolean>;

	abstract getAvailableSlots(
		doctorId: uuid,
	): Promise<Array<AvailableSlotResponseDTO>>;

	abstract isDoctorAvailable(
		doctorId: uuid,
		targetDate: Date,
	): Promise<boolean>;

	abstract cancel(scheduleId: uuid): Promise<ScheduleResponseDTO | null>;
	abstract complete(scheduleId: uuid): Promise<ScheduleResponseDTO | null>;
}
