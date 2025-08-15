type RedisValue = string | number | Buffer<ArrayBufferLike>;

export interface CacheBase {
	set<ContentType extends RedisValue>(key: string, value: ContentType, ex?: number): Promise<void>;
	get<ContentType = unknown>(key: string): Promise<ContentType | null>;
}
