import { RedisCache } from "@/cache";
import { DoctorsRepository } from "@/repositories/prisma";
import { CreateDoctorService } from "@/services/doctors";

export function makeCreateDoctorFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsRepository(cache);

	return new CreateDoctorService(repository);
}
