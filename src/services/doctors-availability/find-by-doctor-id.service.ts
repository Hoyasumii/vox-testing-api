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
		const ex = 60 * 60 * 24;

		if (!success) return this.repository.errors.badRequest();

		const storedDoctorAvailability = await this.repository.cache.get<string>(
			`doctor-availability-doctor-${id}`,
		);

		const response = storedDoctorAvailability
			? (JSON.parse(storedDoctorAvailability) as Array<DoctorAvailabilityDTO>)
			: await this.repository.findByDoctorId(id);

		if (!storedDoctorAvailability) {
			await this.repository.cache.set(
				`doctor-availability-doctor-${id}`,
				JSON.stringify(response),
				ex,
			);
		}

		return response;
	}
}
