import type { uuid } from "@/dtos";
import type {
	CreateDoctorAvailabilityDTO,
	DoctorAvailabilityDTO,
	UpdateDoctorAvailabilityDTO,
} from "@/dtos/doctors-availability";
import { DoctorsAvailabilityRepositoryBase } from "@/repositories";
import { prisma } from "@/utils";

export class DoctorsAvailabilityRepository extends DoctorsAvailabilityRepositoryBase {
	async create(data: CreateDoctorAvailabilityDTO): Promise<void> {
		await prisma.doctorAvailability.create({ data });
	}

	async findById(id: uuid): Promise<DoctorAvailabilityDTO | null> {
		return await prisma.doctorAvailability.findUnique({
			where: { id },
		});
	}

	async findByDoctorId(id: uuid): Promise<Array<DoctorAvailabilityDTO>> {
		return await prisma.doctorAvailability.findMany({
			where: { doctorId: id },
		});
	}

	async deleteById(id: uuid): Promise<boolean> {
		const response = await prisma.doctorAvailability.deleteMany({
			where: { id },
		});

		return response.count === 1;
	}

	async deleteByDoctorId(id: uuid): Promise<number> {
		const { count } = await prisma.doctorAvailability.deleteMany({
			where: { doctorId: id },
		});

		return count;
	}

	async update(
		id: uuid,
		content: UpdateDoctorAvailabilityDTO,
	): Promise<boolean> {
		const { count } = await prisma.doctorAvailability.updateMany({
			where: { id },
			data: content,
		});

		return count === 1;
	}
}
