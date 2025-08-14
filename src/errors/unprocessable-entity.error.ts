import { ApplicationError } from "./application.error";

export class UnprocessableEntityError extends ApplicationError {
	constructor(message: string = "Unprocessable entity") {
		super("UnprocessableEntityError", 422, message);
		Object.setPrototypeOf(this, UnprocessableEntityError.prototype);
	}
}
