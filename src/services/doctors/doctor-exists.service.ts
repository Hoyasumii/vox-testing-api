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

		if (!success) return this.repository.errors.badRequest();

		return await this.repository.exists(id);
	}
}
