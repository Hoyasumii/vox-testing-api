import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";

export function makeUpdateDoctorAvailabilityFactory() {
	const repository = new DoctorsAvailabilityRepository();

	return new UpdateDoctorAvailabilityService(repository);
}
