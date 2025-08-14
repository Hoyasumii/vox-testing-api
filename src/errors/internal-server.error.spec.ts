import { InternalServerError } from "./internal-server.error";

describe("InternalServerError", () => {
	it("should create error with default message", () => {
		const error = new InternalServerError();

		expect(error.name).toBe("InternalServerError");
		expect(error.status).toBe(500);
		expect(error.message).toBe("Internal server error");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Falha na conexão com o banco de dados";
		const error = new InternalServerError(customMessage);

		expect(error.name).toBe("InternalServerError");
		expect(error.status).toBe(500);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new InternalServerError();
		expect(error instanceof InternalServerError).toBe(true);
	});
});
