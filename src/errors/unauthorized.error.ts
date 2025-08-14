import { ApplicationError } from "./application.error";

export class UnauthorizedError extends ApplicationError {
	constructor(message: string = "Unauthorized") {
		super("UnauthorizedError", 401, message);
		Object.setPrototypeOf(this, UnauthorizedError.prototype);
	}
}
