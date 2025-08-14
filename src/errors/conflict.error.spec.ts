import { ConflictError } from "./conflict.error";

describe("ConflictError", () => {
	it("should create error with default message", () => {
		const error = new ConflictError();

		expect(error.name).toBe("ConflictError");
		expect(error.status).toBe(409);
		expect(error.message).toBe("Conflict");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Email já está em uso";
		const error = new ConflictError(customMessage);

		expect(error.name).toBe("ConflictError");
		expect(error.status).toBe(409);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new ConflictError();
		expect(error instanceof ConflictError).toBe(true);
	});
});
