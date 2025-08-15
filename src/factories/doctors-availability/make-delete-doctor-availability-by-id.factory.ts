import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { DeleteDoctorAvailabilityByIdService } from "@/services/doctors-availability";

export function makeDeleteDoctorAvailabilityByIdFactory() {
	const repository = new DoctorsAvailabilityRepository();

	return new DeleteDoctorAvailabilityByIdService(repository);
}
