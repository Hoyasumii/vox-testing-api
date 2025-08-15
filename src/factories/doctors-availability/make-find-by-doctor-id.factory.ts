import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { FindByDoctorIdService } from "@/services/doctors-availability";

export function makeFindByDoctorIdFactory() {
	const repository = new DoctorsAvailabilityRepository();

	return new FindByDoctorIdService(repository);
}
