import { ApplicationError } from "./application.error";

export class ConflictError extends ApplicationError {
	constructor(message: string = "Conflict") {
		super("ConflictError", 409, message);
		Object.setPrototypeOf(this, ConflictError.prototype);
	}
}
