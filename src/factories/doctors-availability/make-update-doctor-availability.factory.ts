import { RedisCache } from "@/cache";
import channels from "@/channels";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";

export function makeUpdateDoctorAvailabilityFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache, channels);
	return new UpdateDoctorAvailabilityService(repository);
}
