import { TooManyRequestsError } from "./too-many-requests.error";

describe("TooManyRequestsError", () => {
	it("should create error with default message", () => {
		const error = new TooManyRequestsError();

		expect(error.name).toBe("TooManyRequestsError");
		expect(error.status).toBe(429);
		expect(error.message).toBe("Too many requests");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Limite de requisições excedido. Tente novamente em alguns minutos";
		const error = new TooManyRequestsError(customMessage);

		expect(error.name).toBe("TooManyRequestsError");
		expect(error.status).toBe(429);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new TooManyRequestsError();
		expect(error instanceof TooManyRequestsError).toBe(true);
	});
});
