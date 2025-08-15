import type { CacheBase } from "@/cache";
import { RepositoryBase } from "./repository-base";

export abstract class CacheableRepositoryBase extends RepositoryBase {
	constructor(public readonly cache: CacheBase) {
		super();
	}
}
