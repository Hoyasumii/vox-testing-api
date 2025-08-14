import { ApplicationError } from "./application.error";

export class ForbiddenError extends ApplicationError {
	constructor(message: string = "Forbidden") {
		super("ForbiddenError", 403, message);
		Object.setPrototypeOf(this, ForbiddenError.prototype);
	}
}
