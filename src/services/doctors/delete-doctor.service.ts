import { uuid } from "@/dtos";
import type { DoctorsRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class DeleteDoctorService extends Service<
	DoctorsRepositoryBase,
	uuid,
	boolean
> {
	async run(id: uuid): Promise<boolean> {
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		const doctorIsRemoved = await this.repository.deleteById(id);

		if (doctorIsRemoved) {
			await this.repository.cache.del(`doctor-${id}`);
		}

		return doctorIsRemoved;
	}
}
