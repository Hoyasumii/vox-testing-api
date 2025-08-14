import { ApplicationError } from "./application.error";

export class NotFoundError extends ApplicationError {
	constructor(message: string = "Not found") {
		super("NotFoundError", 404, message);
		Object.setPrototypeOf(this, NotFoundError.prototype);
	}
}
