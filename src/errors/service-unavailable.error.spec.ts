import { ServiceUnavailableError } from "./service-unavailable.error";

describe("ServiceUnavailableError", () => {
	it("should create error with default message", () => {
		const error = new ServiceUnavailableError();

		expect(error.name).toBe("ServiceUnavailableError");
		expect(error.status).toBe(503);
		expect(error.message).toBe("Service unavailable");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Serviço em manutenção. Tente novamente mais tarde";
		const error = new ServiceUnavailableError(customMessage);

		expect(error.name).toBe("ServiceUnavailableError");
		expect(error.status).toBe(503);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new ServiceUnavailableError();
		expect(error instanceof ServiceUnavailableError).toBe(true);
	});
});
