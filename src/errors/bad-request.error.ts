import { ApplicationError } from "./application.error";

export class BadRequestError extends ApplicationError {
	constructor(message: string = "Bad request") {
		super("BadRequestError", 400, message);
		Object.setPrototypeOf(this, BadRequestError.prototype);
	}
}
