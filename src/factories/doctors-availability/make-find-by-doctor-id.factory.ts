import { RedisCache } from "@/cache";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { FindByDoctorIdService } from "@/services/doctors-availability";

export function makeFindByDoctorIdFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new FindByDoctorIdService(repository);
}
