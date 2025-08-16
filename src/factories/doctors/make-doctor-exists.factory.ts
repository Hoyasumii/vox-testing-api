import { RedisCache } from "@/cache";
import channels from "@/channels";
import { DoctorsRepository } from "@/repositories/prisma";
import { DoctorExistsService } from "@/services/doctors";

export function makeDoctorExistsFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsRepository(cache, channels);

	return new DoctorExistsService(repository);
}
