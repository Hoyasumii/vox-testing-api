import { ApplicationError } from "./application.error";

export class InternalServerError extends ApplicationError {
	constructor(message: string = "Internal server error") {
		super("InternalServerError", 500, message);
		Object.setPrototypeOf(this, InternalServerError.prototype);
	}
}
