import errors from "@/errors";
import type { ChannelBase } from "./channel-base";
import type { CacheBase } from "@/cache";

export abstract class RepositoryBase {
	public readonly errors = errors;

	constructor(
		public readonly cache: CacheBase,
		public readonly channel: ChannelBase,
	) {}
}
