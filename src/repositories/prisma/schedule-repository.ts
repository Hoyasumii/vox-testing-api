import type { uuid } from "@/dtos";
import type {
	AvailableSlotResponseDTO,
	CreateScheduleDTO,
	ScheduleResponseDTO,
} from "@/dtos/schedules";
import { ScheduleRepositoryBase } from "@/repositories";
import { prisma } from "@/utils";

export class ScheduleRepository extends ScheduleRepositoryBase {
	async create(data: CreateScheduleDTO): Promise<ScheduleResponseDTO> {
		return await prisma.schedule.create({
			data,
		});
	}

	async cancel(scheduleId: uuid): Promise<ScheduleResponseDTO> {
		return await prisma.schedule.update({
			where: {
				id: scheduleId,
			},
			data: {
				status: "CANCELED",
			},
		});
	}

	async complete(scheduleId: uuid): Promise<ScheduleResponseDTO> {
		return await prisma.schedule.update({
			where: {
				id: scheduleId,
			},
			data: {
				status: "COMPLETED",
			},
		});
	}

	async isDoctorAvailable(doctorId: uuid, targetDate: Date): Promise<boolean> {
		const dayOfWeek = targetDate.getDay();
		const hour = targetDate.getHours();

		const availability = await prisma.doctorAvailability.findFirst({
			where: {
				doctorId,
				dayOfWeek,
				startHour: { lte: hour },
				endHour: { gt: hour },
			},
		});

		if (!availability) {
			return false;
		}

		const existingSchedule = await prisma.schedule.findFirst({
			where: {
				doctorId,
				scheduledAt: targetDate,
				status: { not: "CANCELED" },
			},
		});

		return !existingSchedule;
	}

	async findByDoctorId(doctorId: uuid): Promise<Array<ScheduleResponseDTO>> {
		return await prisma.schedule.findMany({ where: { doctorId } });
	}

	async findByPatientId(patientId: uuid): Promise<Array<ScheduleResponseDTO>> {
		return await prisma.schedule.findMany({ where: { patientId } });
	}

	async findById(scheduleId: uuid): Promise<ScheduleResponseDTO | null> {
		return await prisma.schedule.findUnique({ where: { id: scheduleId } });
	}

	async getAvailableSlots(
		doctorId: uuid,
		startDate: Date = new Date(),
		endDate: Date = startDate,
	): Promise<Array<AvailableSlotResponseDTO>> {
		const availabilities = await prisma.doctorAvailability.findMany({
			where: {
				doctorId,
			},
		});

		if (availabilities.length === 0) {
			return [];
		}

		const existingSchedules = await prisma.schedule.findMany({
			where: {
				doctorId,
				scheduledAt: {
					gte: startDate,
					lte: endDate,
				},
				status: { not: "CANCELED" },
			},
		});

		const occupiedSlots = new Set(
			existingSchedules.map((schedule) => schedule.scheduledAt.getTime()),
		);

		const availableSlots: AvailableSlotResponseDTO[] = [];

		// Iterar através das datas no intervalo
		const currentDate = new Date(startDate);
		while (currentDate <= endDate) {
			const dayOfWeek = currentDate.getDay();

			const dayAvailabilities = availabilities.filter(
				(av) => av.dayOfWeek === dayOfWeek,
			);

			for (const availability of dayAvailabilities) {
				for (
					let hour = availability.startHour;
					hour < availability.endHour;
					hour++
				) {
					const slotDateTime = new Date(currentDate);
					slotDateTime.setHours(hour, 0, 0, 0);

					if (slotDateTime < new Date()) {
						continue;
					}

					const isOccupied = occupiedSlots.has(slotDateTime.getTime());

					availableSlots.push({
						availabilityId: availability.id,
						doctorId,
						dayOfWeek,
						startHour: hour,
						endHour: hour + 1,
						availableDate: new Date(slotDateTime),
						isAvailable: !isOccupied,
					});
				}
			}

			currentDate.setDate(currentDate.getDate() + 1);
		}

		return availableSlots.sort(
			(a, b) => a.availableDate.getTime() - b.availableDate.getTime(),
		);
	}

	async delete(scheduleId: uuid): Promise<boolean> {
		try {
			await prisma.schedule.delete({
				where: {
					id: scheduleId,
				},
			});
			return true;
		} catch {
			return false;
		}
	}
}
