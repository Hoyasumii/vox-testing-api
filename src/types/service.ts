// import type { ZodType } from "zod";
import type { RepositoryBase } from "./repository-base";

export abstract class Service<
	RepositoryType extends RepositoryBase,
	Args,
	Output,
> {
	constructor(protected readonly repository: RepositoryType) {}

	abstract run(data: Args): Promise<Output>;
}

// abstract class NextService<
// 	RepositoryType extends RepositoryBase,
// 	Output,
// 	DTO extends ZodType,
// 	Args extends ZodType = DTO,
// > {
// 	protected abstract dto: DTO;

// 	constructor(protected readonly repository: RepositoryType) {}

// 	run(data: Args): Promise<Output> {
// 		const {success} = this.dto.safeParse(data);

// 		if (!success) this.repository.errors.badRequest();


// 	}

// 	validate()
// }
