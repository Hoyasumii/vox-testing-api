import { BadRequestError } from "./bad-request.error";

describe("BadRequestError", () => {
	it("should create error with default message", () => {
		const error = new BadRequestError();

		expect(error.name).toBe("BadRequestError");
		expect(error.status).toBe(400);
		expect(error.message).toBe("Bad request");
		expect(error instanceof Error).toBe(true);
	});

	it("should create error with custom message", () => {
		const customMessage = "Invalid input data";
		const error = new BadRequestError(customMessage);

		expect(error.name).toBe("BadRequestError");
		expect(error.status).toBe(400);
		expect(error.message).toBe(customMessage);
		expect(error instanceof Error).toBe(true);
	});

	it("should have correct prototype", () => {
		const error = new BadRequestError();
		expect(error instanceof BadRequestError).toBe(true);
	});
});
