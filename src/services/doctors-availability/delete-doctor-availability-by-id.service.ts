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

		const targetDoctorAvailability = await this.repository.findById(id);

		if (!targetDoctorAvailability) return this.repository.errors.notFound();

		const { doctorId } = targetDoctorAvailability;

		await this.repository.cache.del(`doctor-availability-doctor-${doctorId}`);

		return await this.repository.deleteById(id);
	}
}
