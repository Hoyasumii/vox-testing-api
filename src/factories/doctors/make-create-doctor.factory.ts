import { RedisCache } from "@/cache";
import channels from "@/channels";
import { DoctorsRepository } from "@/repositories/prisma";
import { CreateDoctorService } from "@/services/doctors";

export function makeCreateDoctorFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsRepository(cache, channels);

	return new CreateDoctorService(repository);
}
