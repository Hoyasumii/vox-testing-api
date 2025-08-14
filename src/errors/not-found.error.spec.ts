import { NotFoundError } from "./not-found.error";

describe("NotFoundError", () => {
	it("should create error with default message", () => {
		const error = new NotFoundError();

		expect(error.name).toBe("NotFoundError");
		expect(error.status).toBe(404);
		expect(error.message).toBe("Not found");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Usuário não encontrado";
		const error = new NotFoundError(customMessage);

		expect(error.name).toBe("NotFoundError");
		expect(error.status).toBe(404);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new NotFoundError();
		expect(error instanceof NotFoundError).toBe(true);
	});
});
