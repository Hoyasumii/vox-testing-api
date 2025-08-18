import { uuid } from "@/dtos";
import type { ScheduleResponseDTO } from "@/dtos/schedules";
import type { ScheduleRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class GetScheduleByPatientIdService extends Service<
	ScheduleRepositoryBase,
	uuid,
	Array<ScheduleResponseDTO>
> {
	async run(id: uuid): Promise<Array<ScheduleResponseDTO>> {
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		return await this.repository.findByPatientId(id);
	}
}
