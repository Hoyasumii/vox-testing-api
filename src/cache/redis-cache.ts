import type { CacheBase } from "./cache-base";
import { redis } from "@/utils";

type RedisValue = string | number | Buffer<ArrayBufferLike>;

export class RedisCache implements CacheBase {
	async set<ContentType extends RedisValue>(
		key: string,
		value: ContentType,
		ex?: number,
	): Promise<void> {
		if (ex) {
			if (ex) {
				await redis!.set(key, value, "EX", ex);
			} else {
				await redis!.set(key, value);
			}

			return;
		}

		await redis!.set(key, value);
	}

	async get<ContentType = unknown>(key: string): Promise<ContentType | null> {
		return (await redis!.get(key)) as ContentType;
	}
}
