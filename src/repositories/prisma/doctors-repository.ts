import type { uuid } from "@/dtos";
import { DoctorsRepositoryBase } from "@/repositories";
import { prisma } from "@/utils";

export class DoctorsRepository extends DoctorsRepositoryBase {
	async create(id: uuid): Promise<void> {
		await prisma.doctor.create({
			data: {
				id,
			},
		});
	}

	async deleteById(id: uuid): Promise<boolean> {
		const { count } = await prisma.doctor.deleteMany({ where: { id } });

		return count === 1;
	}

	async exists(id: uuid): Promise<boolean> {
		const response = await prisma.doctor.findUnique({ where: { id } });

		return response !== null;
	}
}
