import { RedisCache } from "@/cache";
import channels from "@/channels";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { IsDoctorAvailabilityExistsService } from "@/services/doctors-availability";

export function makeIsDoctorAvailabilityExistsFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache, channels);

	return new IsDoctorAvailabilityExistsService(repository);
}
