import { RedisCache } from "@/cache";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";

export function makeCreateDoctorAvailabilityFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new CreateDoctorAvailabilityService(repository);
}
