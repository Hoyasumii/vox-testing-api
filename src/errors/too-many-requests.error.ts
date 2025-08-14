import { ApplicationError } from "./application.error";

export class TooManyRequestsError extends ApplicationError {
	constructor(message: string = "Too many requests") {
		super("TooManyRequestsError", 429, message);
		Object.setPrototypeOf(this, TooManyRequestsError.prototype);
	}
}
