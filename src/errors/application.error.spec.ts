import { ApplicationError } from "./application.error";

class TestError extends ApplicationError {
	constructor(message?: string) {
		super("TestError", 418, message);
	}
}

describe("ApplicationError", () => {
	it("should create error with provided parameters", () => {
		const error = new TestError("Test message");

		expect(error.name).toBe("TestError");
		expect(error.status).toBe(418);
		expect(error.message).toBe("Test message");
		expect(error instanceof Error).toBe(true);
		expect(error instanceof ApplicationError).toBe(true);
	});

	it("should use name as default message when message is not provided", () => {
		const error = new TestError();

		expect(error.name).toBe("TestError");
		expect(error.status).toBe(418);
		expect(error.message).toBe("TestError");
	});

	it("should have default status of 500 when not provided", () => {
		class DefaultStatusError extends ApplicationError {
			constructor() {
				super("DefaultStatusError");
			}
		}

		const error = new DefaultStatusError();
		expect(error.status).toBe(500);
	});
});
