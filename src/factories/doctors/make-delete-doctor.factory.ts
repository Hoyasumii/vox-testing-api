import { RedisCache } from "@/cache";
import { DoctorsRepository } from "@/repositories/prisma";
import { DeleteDoctorService } from "@/services/doctors";

export function makeDeleteDoctorFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsRepository(cache);

	return new DeleteDoctorService(repository);
}
