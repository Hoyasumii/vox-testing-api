import { RedisCache } from "@/cache";
import channels from "@/channels";
import { DoctorsRepository } from "@/repositories/prisma";
import { DeleteDoctorService } from "@/services/doctors";

export function makeDeleteDoctorFactory() {
	const cache = new RedisCache();
	const repository = new DoctorsRepository(cache, channels);

	return new DeleteDoctorService(repository);
}
