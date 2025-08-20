import { RedisCache } from "@/cache";
import channels from "@/channels";
import { ScheduleRepository } from "@/repositories/prisma";
import { DeleteScheduleService } from "@/services/schedule";

export function makeDeleteScheduleFactory() {
	const cache = new RedisCache();
	const repository = new ScheduleRepository(cache, channels);

	return new DeleteScheduleService(repository);
}
