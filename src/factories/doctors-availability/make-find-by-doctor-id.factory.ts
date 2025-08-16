import { RedisCache } from "@/cache";
import channels from "@/channels";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { FindByDoctorIdService } from "@/services/doctors-availability";

export function makeFindByDoctorIdFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache, channels);

	return new FindByDoctorIdService(repository);
}
