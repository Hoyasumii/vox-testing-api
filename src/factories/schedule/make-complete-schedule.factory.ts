import { RedisCache } from "@/cache";
import channels from "@/channels";
import { ScheduleRepository } from "@/repositories/prisma";
import { CompleteScheduleService } from "@/services/schedule";

export function makeCompleteScheduleFactory() {
	const cache = new RedisCache();
	const repository = new ScheduleRepository(cache, channels);

	return new CompleteScheduleService(repository);
}
