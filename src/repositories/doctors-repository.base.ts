import { RepositoryBase } from "@/types";

export abstract class DoctorsRepositoryBase extends RepositoryBase {
	abstract create(): Promise<void>;
	abstract findById(): Promise<void>;
	abstract deleteById(): Promise<void>;
}
