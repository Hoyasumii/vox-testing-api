import type { uuid } from "@/dtos";
import { RepositoryBase } from "@/types";

export abstract class DoctorsRepositoryBase extends RepositoryBase {
	abstract create(id: uuid): Promise<void>;
	abstract exists(id: uuid): Promise<boolean>;
	abstract deleteById(id: uuid): Promise<boolean>;
}
