import { MethodNotAllowedError } from "./method-not-allowed.error";

describe("MethodNotAllowedError", () => {
	it("should create error with default message", () => {
		const error = new MethodNotAllowedError();

		expect(error.name).toBe("MethodNotAllowedError");
		expect(error.status).toBe(405);
		expect(error.message).toBe("Method not allowed");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Método POST não permitido neste endpoint";
		const error = new MethodNotAllowedError(customMessage);

		expect(error.name).toBe("MethodNotAllowedError");
		expect(error.status).toBe(405);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new MethodNotAllowedError();
		expect(error instanceof MethodNotAllowedError).toBe(true);
	});
});
