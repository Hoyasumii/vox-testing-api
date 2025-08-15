import { uuid } from "@/dtos";
import type { DoctorsAvailabilityRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class DeleteDoctorAvailabilityByDoctorIdService extends Service<
	DoctorsAvailabilityRepositoryBase,
	uuid,
	number
> {
	async run(id: uuid): Promise<number> {
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		await this.repository.cache.del(`doctor-availability-doctor-${id}`);

		return await this.repository.deleteByDoctorId(id);
	}
}
