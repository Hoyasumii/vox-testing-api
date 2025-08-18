import { uuid } from "@/dtos";
import type { DoctorsAvailabilityRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class IsDoctorAvailabilityExistsService extends Service<
	DoctorsAvailabilityRepositoryBase,
	uuid,
	boolean
> {
	async run(id: uuid): Promise<boolean> {
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		return (await this.repository.findById(id)) !== null;
	}
}
