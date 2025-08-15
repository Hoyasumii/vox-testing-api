import { uuid } from "@/dtos";
import { UpdateDoctorAvailabilityDTO } from "@/dtos/doctors-availability";
import type { DoctorsAvailabilityRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class UpdateDoctorAvailabilityService extends Service<
	DoctorsAvailabilityRepositoryBase,
	{ id: uuid; content: UpdateDoctorAvailabilityDTO },
	boolean
> {
	async run({
		content,
		id,
	}: {
		id: uuid;
		content: UpdateDoctorAvailabilityDTO;
	}): Promise<boolean> {
		const { success: idIsValid } = uuid.safeParse(id);
		const { success: contentIsValid } =
			UpdateDoctorAvailabilityDTO.safeParse(content);

		if (!idIsValid || !contentIsValid)
			return this.repository.errors.badRequest();

		return await this.repository.update(id, content);
	}
}
