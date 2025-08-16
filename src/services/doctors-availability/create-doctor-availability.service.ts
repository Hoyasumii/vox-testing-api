import type { uuid } from "@/dtos";
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

		const doctorExists = await this.repository.channel.talk<uuid, boolean>(
			"doctor:exists",
			data.doctorId,
		);

		if (!doctorExists) return this.repository.errors.notFound();

		try {
			await this.repository.create(data);

			await this.repository.cache.del(
				`doctor-availability-doctor-${data.doctorId}`,
			);

			return true;
		} catch (_) {
			return false;
		}
	}
}
