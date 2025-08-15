import { uuid } from "@/dtos";
import type { DoctorsRepositoryBase } from "@/repositories";
import { Service } from "@/types";

export class CreateDoctorService extends Service<
	DoctorsRepositoryBase,
	uuid,
	boolean
> {
	async run(id: uuid): Promise<boolean> {
		const { success } = uuid.safeParse(id);

		if (!success) return this.repository.errors.badRequest();

		try {
			await this.repository.create(id);

			return true;
		} catch (_) {
			return false;
		}
	}
}
