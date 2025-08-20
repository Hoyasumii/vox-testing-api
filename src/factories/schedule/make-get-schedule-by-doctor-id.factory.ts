import { RedisCache } from "@/cache";
import channels from "@/channels";
import { ScheduleRepository } from "@/repositories/prisma";
import { GetScheduleByDoctorIdService } from "@/services/schedule";

export function makeGetScheduleByDoctorIdFactory() {
	const cache = new RedisCache();
	const repository = new ScheduleRepository(cache, channels);

	return new GetScheduleByDoctorIdService(repository);
}
