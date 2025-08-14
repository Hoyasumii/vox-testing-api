import { ApplicationError } from "./application.error";

export class MethodNotAllowedError extends ApplicationError {
	constructor(message: string = "Method not allowed") {
		super("MethodNotAllowedError", 405, message);
		Object.setPrototypeOf(this, MethodNotAllowedError.prototype);
	}
}
