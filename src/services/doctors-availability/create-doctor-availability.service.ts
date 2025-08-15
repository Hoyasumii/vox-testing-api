import { CreateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import type { DoctorsAvailabilityRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class CreateDoctorAvailabilityService extends Service<
	DoctorsAvailabilityRepositoryBase,
	CreateDoctorAvailabilityDTO,
	boolean
> {
	async run(data: CreateDoctorAvailabilityDTO): Promise<boolean> {
		const { success } = CreateDoctorAvailabilityDTO.safeParse(data);

		if (!success) return this.repository.errors.badRequest();

		try {
			await this.repository.create(data);

			return true;
		} catch (_) {
			return false;
		}
	}
}
