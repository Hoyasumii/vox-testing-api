import { RedisCache } from "@/cache";
import channels from "@/channels";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";

export function makeCreateDoctorAvailabilityFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache, channels);

	return new CreateDoctorAvailabilityService(repository);
}
