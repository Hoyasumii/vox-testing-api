import { RedisCache } from "@/cache";
import channels from "@/channels";
import { ScheduleRepository } from "@/repositories/prisma";
import { GetScheduleByPatientIdService } from "@/services/schedule";

export function makeGetScheduleByPatientIdFactory() {
	const cache = new RedisCache();
	const repository = new ScheduleRepository(cache, channels);

	return new GetScheduleByPatientIdService(repository);
}
