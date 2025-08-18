import type { uuid } from "@/dtos";
import type { ScheduleRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class DeleteScheduleService extends Service<
	ScheduleRepositoryBase,
	uuid,
	boolean
> {
	async run(id: uuid): Promise<boolean> {
		return await this.repository.delete(id);
	}
}
