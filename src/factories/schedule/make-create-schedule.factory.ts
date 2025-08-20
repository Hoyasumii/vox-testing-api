import { RedisCache } from "@/cache";
import channels from "@/channels";
import { ScheduleRepository } from "@/repositories/prisma";
import { CreateScheduleService } from "@/services/schedule";

export function makeCreateScheduleFactory() {
	const cache = new RedisCache();
	const repository = new ScheduleRepository(cache, channels);

	return new CreateScheduleService(repository);
}
