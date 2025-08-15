import type { uuid } from "@/dtos";
import { CacheableRepositoryBase } from "@/types";

export abstract class DoctorsRepositoryBase extends CacheableRepositoryBase {
	abstract create(id: uuid): Promise<void>;
	abstract exists(id: uuid): Promise<boolean>;
	abstract deleteById(id: uuid): Promise<boolean>;
}
