import type { RepositoryBase } from "./repository-base";

export abstract class Service<
	RepositoryType extends RepositoryBase,
	Args,
	Output,
> {
	constructor(protected readonly repository: RepositoryType) {}

	abstract run(data: Args): Promise<Output>;
}
