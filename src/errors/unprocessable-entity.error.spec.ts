import { UnprocessableEntityError } from "./unprocessable-entity.error";

describe("UnprocessableEntityError", () => {
	it("should create error with default message", () => {
		const error = new UnprocessableEntityError();

		expect(error.name).toBe("UnprocessableEntityError");
		expect(error.status).toBe(422);
		expect(error.message).toBe("Unprocessable entity");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Dados de validação inválidos";
		const error = new UnprocessableEntityError(customMessage);

		expect(error.name).toBe("UnprocessableEntityError");
		expect(error.status).toBe(422);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new UnprocessableEntityError();
		expect(error instanceof UnprocessableEntityError).toBe(true);
	});
});
