import { RedisCache } from "@/cache";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";

export function makeDeleteDoctorAvailabilityByDoctorIdFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache);

	return new DeleteDoctorAvailabilityByDoctorIdService(repository);
}
