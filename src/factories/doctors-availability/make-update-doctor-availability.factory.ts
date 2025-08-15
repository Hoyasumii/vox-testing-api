import { RedisCache } from "@/cache";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";

export function makeUpdateDoctorAvailabilityFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new UpdateDoctorAvailabilityService(repository);
}
