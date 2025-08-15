import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";

export function makeDeleteDoctorAvailabilityByDoctorIdFactory() {
	const repository = new DoctorsAvailabilityRepository();

	return new DeleteDoctorAvailabilityByDoctorIdService(repository);
}
