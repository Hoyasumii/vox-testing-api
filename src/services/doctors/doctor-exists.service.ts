import { uuid } from "@/dtos";
import type { DoctorsRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class DoctorExistsService extends Service<
	DoctorsRepositoryBase,
	uuid,
	boolean
> {
	async run(id: uuid): Promise<boolean> {
		const { success } = uuid.safeParse(id);
		const ex = 60 * 60 * 24;

		if (!success) return this.repository.errors.badRequest();

		const cachedDoctorId = await this.repository.cache.get<1>(`doctor-${id}`);

		const doctorId = cachedDoctorId ? true : await this.repository.exists(id);

		if (!cachedDoctorId) {
			await this.repository.cache.set(`doctor-${id}`, 1, ex);
		}

		return doctorId;
	}
}
