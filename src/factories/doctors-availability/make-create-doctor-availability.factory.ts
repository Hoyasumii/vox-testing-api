import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";

export function makeCreateDoctorAvailabilityFactory() {
	const repository = new DoctorsAvailabilityRepository();

	return new CreateDoctorAvailabilityService(repository);
}
