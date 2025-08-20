import { RedisCache } from "@/cache";
import channels from "@/channels";
import { ScheduleRepository } from "@/repositories/prisma";
import { CancelScheduleService } from "@/services/schedule";

export function makeCancelScheduleFactory() {
	const cache = new RedisCache();
	const repository = new ScheduleRepository(cache, channels);

	return new CancelScheduleService(repository);
}
