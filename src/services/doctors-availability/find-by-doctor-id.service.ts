import { uuid } from "@/dtos";
import type { DoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import type { DoctorsAvailabilityRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class FindByDoctorIdService extends Service<
	DoctorsAvailabilityRepositoryBase,
	uuid,
	Array<DoctorAvailabilityDTO>
> {
	async run(id: uuid): Promise<Array<DoctorAvailabilityDTO>> {
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		return await this.repository.findByDoctorId(id);
	}
}
