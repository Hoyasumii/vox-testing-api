import { RedisCache } from "@/cache";
import channels from "@/channels";
import { DoctorsAvailabilityRepository } from "@/repositories/prisma";
import { DeleteDoctorAvailabilityByIdService } from "@/services/doctors-availability";

export function makeDeleteDoctorAvailabilityByIdFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsAvailabilityRepository(cache, channels);

	return new DeleteDoctorAvailabilityByIdService(repository);
}
