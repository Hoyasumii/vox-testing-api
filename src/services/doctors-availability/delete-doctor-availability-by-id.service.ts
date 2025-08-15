import { uuid } from "@/dtos";
import type { DoctorsAvailabilityRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class DeleteDoctorAvailabilityByIdService extends Service<
	DoctorsAvailabilityRepositoryBase,
	uuid,
	boolean
> {
	async run(id: uuid): Promise<boolean> {
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		// await this.repository.

		// await this.repository.cache.del(`doctor-availabi/lity-${data.doctorId}`);

		return await this.repository.deleteById(id);
	}
}
