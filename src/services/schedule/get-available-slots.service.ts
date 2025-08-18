import { uuid } from "@/dtos";
import type { AvailableSlotResponseDTO } from "@/dtos/schedules";
import type { ScheduleRepositoryBase } from "@/repositories";
import { Service } from "@/types";

type Args = {
	doctorId: uuid;
	startDate?: Date;
	endDate?: Date;
};

export class GetAvailableSlotsSerice extends Service<
	ScheduleRepositoryBase,
	Args,
	Array<AvailableSlotResponseDTO>
> {
	async run({
		doctorId,
		startDate,
		endDate,
	}: Args): Promise<Array<AvailableSlotResponseDTO>> {
		const { success } = uuid.safeParse(doctorId);

		startDate = startDate ?? new Date();
		endDate = endDate ?? new Date();

		if (!success) return this.repository.errors.badRequest();

		return this.repository.getAvailableSlots(doctorId, startDate, endDate);
	}
}
