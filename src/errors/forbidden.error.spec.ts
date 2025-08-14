import { ForbiddenError } from "./forbidden.error";

describe("ForbiddenError", () => {
	it("should create error with default message", () => {
		const error = new ForbiddenError();

		expect(error.name).toBe("ForbiddenError");
		expect(error.status).toBe(403);
		expect(error.message).toBe("Forbidden");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Acesso negado para este recurso";
		const error = new ForbiddenError(customMessage);

		expect(error.name).toBe("ForbiddenError");
		expect(error.status).toBe(403);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new ForbiddenError();
		expect(error instanceof ForbiddenError).toBe(true);
	});
});
