import type { uuid } from "@/dtos";
import { RepositoryBase } from "@/types";

export abstract class ScheduleRepositoryBase extends RepositoryBase {
  // TODO: Ver se o patientId existe
  // TODO: Ver se o doctorId existe
  // TODO: Ver se o availabilityId existe
  // TODO: Ver se doctorId tem disponibilidade(com base no scheduledAt)
  // TODO: Ver se o patientId tem disponibilidade(com base no scheduledAt)
  abstract create(): void;
  abstract findById(scheduleId: uuid): void;
  abstract findByPatientId(patientId: uuid): void;
  abstract findByDoctorId(doctorId: uuid): void;
  abstract delete(): void;

  abstract getAvailableSlots(doctorId: uuid): void;

  abstract isDoctorAvailable(doctorId: uuid, targetDate: Date): void;

  abstract cancel(scheduleId: uuid): void;
  abstract complete(scheduleId: uuid): void;
}