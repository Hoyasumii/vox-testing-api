import { RedisCache } from "@/cache";
import channels from "@/channels";
import { ScheduleRepository } from "@/repositories/prisma";
import { GetScheduleByIdService } from "@/services/schedule";

export function makeGetScheduleByIdFactory() {
	const cache = new RedisCache();
	const repository = new ScheduleRepository(cache, channels);

	return new GetScheduleByIdService(repository);
}
