import { uuid } from "@/dtos";
import type { ScheduleRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class CancelScheduleService extends Service<
	ScheduleRepositoryBase,
	uuid,
	boolean
> {
	async run(id: uuid): Promise<boolean> {
		const { success } = uuid.safeParse(id);

    if (!success) return this.repository.errors.badRequest();

		return (await this.repository.cancel(id)) !== null;
	}
}
