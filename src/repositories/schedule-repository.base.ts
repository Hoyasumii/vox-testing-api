import type { uuid } from "@/dtos";
import type {
	AvailableSlotResponseDTO,
	CreateScheduleDTO,
	ScheduleResponseDTO,
} from "@/dtos/schedules";
import { RepositoryBase } from "@/types";

export abstract class ScheduleRepositoryBase extends RepositoryBase {
	abstract create(data: CreateScheduleDTO): Promise<ScheduleResponseDTO>;
	abstract findById(scheduleId: uuid): Promise<ScheduleResponseDTO | null>;
	abstract findByPatientId(
		patientId: uuid,
	): Promise<Array<ScheduleResponseDTO>>;
	abstract findByDoctorId(doctorId: uuid): Promise<Array<ScheduleResponseDTO>>;
	abstract delete(scheduleId: uuid): Promise<boolean>;

	abstract getAvailableSlots(
		doctorId: uuid,
		startDate: Date,
		endDate: Date,
	): Promise<Array<AvailableSlotResponseDTO>>;

	abstract isDoctorAvailable(
		doctorId: uuid,
		targetDate: Date,
	): Promise<boolean>;

	abstract cancel(scheduleId: uuid): Promise<ScheduleResponseDTO | null>;
	abstract complete(scheduleId: uuid): Promise<ScheduleResponseDTO | null>;
}
