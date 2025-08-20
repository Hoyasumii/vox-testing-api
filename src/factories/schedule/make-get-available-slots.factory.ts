import { RedisCache } from "@/cache";
import channels from "@/channels";
import { ScheduleRepository } from "@/repositories/prisma";
import { GetAvailableSlotsSerice } from "@/services/schedule";

export function makeGetAvailableSlotsFactory() {
	const cache = new RedisCache();
	const repository = new ScheduleRepository(cache, channels);

	return new GetAvailableSlotsSerice(repository);
}
