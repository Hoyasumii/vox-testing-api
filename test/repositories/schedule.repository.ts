import type { uuid } from "@/dtos";
import {
	CreateScheduleDTO,
	ScheduleResponseDTO,
	AvailableSlotResponseDTO,
	ScheduleStatus,
} from "@/dtos/schedules";
import { ScheduleRepositoryBase } from "@/repositories/schedule-repository.base";
import { randomUUID } from "node:crypto";

interface InMemorySchedule {
	id: string;
	status: ScheduleStatus;
	availabilityId: string;
	patientId: string;
	doctorId: string;
	scheduledAt: Date;
	createdAt: Date;
	updatedAt: Date;
}

interface InMemoryAvailability {
	availabilityId: string;
	doctorId: string;
	dayOfWeek: number;
	startHour: number;
	endHour: number;
	availableDate: Date;
	isAvailable: boolean;
}

export class ScheduleRepository extends ScheduleRepositoryBase {
	private schedules: InMemorySchedule[] = [];
	private availabilities: InMemoryAvailability[] = [];

	private generateId(): string {
		return randomUUID();
	}

	async create(data: CreateScheduleDTO): Promise<ScheduleResponseDTO> {
		const id = this.generateId();
		const now = new Date();

		const schedule: InMemorySchedule = {
			id,
			status: "SCHEDULED" as ScheduleStatus,
			availabilityId: data.availabilityId,
			patientId: data.patientId,
			doctorId: data.doctorId,
			scheduledAt: data.scheduledAt,
			createdAt: now,
			updatedAt: now,
		};

		this.schedules.push(schedule);

		return {
			id: schedule.id,
			status: schedule.status,
			availabilityId: schedule.availabilityId,
			patientId: schedule.patientId,
			doctorId: schedule.doctorId,
			scheduledAt: schedule.scheduledAt,
		};
	}

	async findById(scheduleId: uuid): Promise<ScheduleResponseDTO | null> {
		const schedule = this.schedules.find((s) => s.id === scheduleId);

		if (!schedule) {
			return null;
		}

		return {
			id: schedule.id,
			status: schedule.status,
			availabilityId: schedule.availabilityId,
			patientId: schedule.patientId,
			doctorId: schedule.doctorId,
			scheduledAt: schedule.scheduledAt,
		};
	}

	async findByPatientId(patientId: uuid): Promise<Array<ScheduleResponseDTO>> {
		return this.schedules
			.filter((s) => s.patientId === patientId)
			.map((schedule) => ({
				id: schedule.id,
				status: schedule.status,
				availabilityId: schedule.availabilityId,
				patientId: schedule.patientId,
				doctorId: schedule.doctorId,
				scheduledAt: schedule.scheduledAt,
			}));
	}

	async findByDoctorId(doctorId: uuid): Promise<Array<ScheduleResponseDTO>> {
		return this.schedules
			.filter((s) => s.doctorId === doctorId)
			.map((schedule) => ({
				id: schedule.id,
				status: schedule.status,
				availabilityId: schedule.availabilityId,
				patientId: schedule.patientId,
				doctorId: schedule.doctorId,
				scheduledAt: schedule.scheduledAt,
			}));
	}

	async delete(scheduleId: uuid): Promise<boolean> {
		const scheduleIndex = this.schedules.findIndex((s) => s.id === scheduleId);

		if (scheduleIndex === -1) {
			return false;
		}

		this.schedules.splice(scheduleIndex, 1);
		return true;
	}

	async getAvailableSlots(
		doctorId: uuid,
	): Promise<Array<AvailableSlotResponseDTO>> {
		return this.availabilities
			.filter((a) => a.doctorId === doctorId && a.isAvailable)
			.map((availability) => ({
				availabilityId: availability.availabilityId,
				doctorId: availability.doctorId,
				dayOfWeek: availability.dayOfWeek,
				startHour: availability.startHour,
				endHour: availability.endHour,
				availableDate: availability.availableDate,
				isAvailable: availability.isAvailable,
			}));
	}

	async isDoctorAvailable(doctorId: uuid, targetDate: Date): Promise<boolean> {
		// Verifica se existe disponibilidade para o médico na data específica
		const hasAvailability = this.availabilities.some(
			(a) =>
				a.doctorId === doctorId &&
				a.isAvailable &&
				a.availableDate.toDateString() === targetDate.toDateString(),
		);

		if (!hasAvailability) {
			return false;
		}

		// Verifica se já existe agendamento para o médico no mesmo horário
		const hasConflictingSchedule = this.schedules.some(
			(s) =>
				s.doctorId === doctorId &&
				s.status === "SCHEDULED" &&
				s.scheduledAt.toDateString() === targetDate.toDateString() &&
				s.scheduledAt.getHours() === targetDate.getHours(),
		);

		return !hasConflictingSchedule;
	}

	async cancel(scheduleId: uuid): Promise<ScheduleResponseDTO | null> {
		const schedule = this.schedules.find((s) => s.id === scheduleId);

		if (!schedule || schedule.status !== "SCHEDULED") return null;

		schedule.status = "CANCELED" as ScheduleStatus;
		schedule.updatedAt = new Date();

		return schedule;
	}

	async complete(scheduleId: uuid): Promise<ScheduleResponseDTO | null> {
		const schedule = this.schedules.find((s) => s.id === scheduleId);

		if (!schedule || schedule.status !== "SCHEDULED") return null;

		schedule.status = "COMPLETED" as ScheduleStatus;
		schedule.updatedAt = new Date();

		return schedule;
	}

	// Métodos auxiliares para testes
	clear(): void {
		this.schedules = [];
		this.availabilities = [];
	}

	count(): number {
		return this.schedules.length;
	}

	findAll(): InMemorySchedule[] {
		return [...this.schedules];
	}

	addAvailability(availability: InMemoryAvailability): void {
		this.availabilities.push(availability);
	}

	clearAvailabilities(): void {
		this.availabilities = [];
	}

	getAvailabilities(): InMemoryAvailability[] {
		return [...this.availabilities];
	}
}
