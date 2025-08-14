export abstract class ApplicationError extends Error {
	constructor(
		name: string,
		public status: number = 500,
		message: string = name,
	) {
		super(message);

		this.name = name;
	}
}
