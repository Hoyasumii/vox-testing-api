import { ApplicationError } from "./application.error";

export class ServiceUnavailableError extends ApplicationError {
	constructor(message: string = "Service unavailable") {
		super("ServiceUnavailableError", 503, message);
		Object.setPrototypeOf(this, ServiceUnavailableError.prototype);
	}
}
