import { RedisCache } from "@/cache";
import { DoctorsRepository } from "@/repositories/prisma";
import { DoctorExistsService } from "@/services/doctors";

export function makeDoctorExistsFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsRepository(cache);

	return new DoctorExistsService(repository);
}
