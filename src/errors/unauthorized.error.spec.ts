import { UnauthorizedError } from "./unauthorized.error";

describe("UnauthorizedError", () => {
	it("should create error with default message", () => {
		const error = new UnauthorizedError();

		expect(error.name).toBe("UnauthorizedError");
		expect(error.status).toBe(401);
		expect(error.message).toBe("Unauthorized");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Token de acesso inválido";
		const error = new UnauthorizedError(customMessage);

		expect(error.name).toBe("UnauthorizedError");
		expect(error.status).toBe(401);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new UnauthorizedError();
		expect(error instanceof UnauthorizedError).toBe(true);
	});
});
