import { ErrorThrowers } from "./index";
import { 
	BadRequestError, 
	UnauthorizedError, 
	ForbiddenError, 
	NotFoundError, 
	MethodNotAllowedError, 
	ConflictError, 
	UnprocessableEntityError, 
	TooManyRequestsError, 
	InternalServerError, 
	ServiceUnavailableError 
} from "./index";

describe("ErrorThrowers", () => {
	describe("badRequest", () => {
		it("should throw BadRequestError with default message", () => {
			expect(() => ErrorThrowers.badRequest()).toThrow(BadRequestError);
			expect(() => ErrorThrowers.badRequest()).toThrow("Bad request");
		});

		it("should throw BadRequestError with custom message", () => {
			const customMessage = "Dados inválidos";
			expect(() => ErrorThrowers.badRequest(customMessage)).toThrow(BadRequestError);
			expect(() => ErrorThrowers.badRequest(customMessage)).toThrow(customMessage);
		});
	});

	describe("unauthorized", () => {
		it("should throw UnauthorizedError with default message", () => {
			expect(() => ErrorThrowers.unauthorized()).toThrow(UnauthorizedError);
			expect(() => ErrorThrowers.unauthorized()).toThrow("Unauthorized");
		});

		it("should throw UnauthorizedError with custom message", () => {
			const customMessage = "Token inválido";
			expect(() => ErrorThrowers.unauthorized(customMessage)).toThrow(UnauthorizedError);
			expect(() => ErrorThrowers.unauthorized(customMessage)).toThrow(customMessage);
		});
	});

	describe("forbidden", () => {
		it("should throw ForbiddenError with default message", () => {
			expect(() => ErrorThrowers.forbidden()).toThrow(ForbiddenError);
			expect(() => ErrorThrowers.forbidden()).toThrow("Forbidden");
		});

		it("should throw ForbiddenError with custom message", () => {
			const customMessage = "Acesso negado";
			expect(() => ErrorThrowers.forbidden(customMessage)).toThrow(ForbiddenError);
			expect(() => ErrorThrowers.forbidden(customMessage)).toThrow(customMessage);
		});
	});

	describe("notFound", () => {
		it("should throw NotFoundError with default message", () => {
			expect(() => ErrorThrowers.notFound()).toThrow(NotFoundError);
			expect(() => ErrorThrowers.notFound()).toThrow("Not found");
		});

		it("should throw NotFoundError with custom message", () => {
			const customMessage = "Usuário não encontrado";
			expect(() => ErrorThrowers.notFound(customMessage)).toThrow(NotFoundError);
			expect(() => ErrorThrowers.notFound(customMessage)).toThrow(customMessage);
		});
	});

	describe("methodNotAllowed", () => {
		it("should throw MethodNotAllowedError with default message", () => {
			expect(() => ErrorThrowers.methodNotAllowed()).toThrow(MethodNotAllowedError);
			expect(() => ErrorThrowers.methodNotAllowed()).toThrow("Method not allowed");
		});

		it("should throw MethodNotAllowedError with custom message", () => {
			const customMessage = "Método não permitido";
			expect(() => ErrorThrowers.methodNotAllowed(customMessage)).toThrow(MethodNotAllowedError);
			expect(() => ErrorThrowers.methodNotAllowed(customMessage)).toThrow(customMessage);
		});
	});

	describe("conflict", () => {
		it("should throw ConflictError with default message", () => {
			expect(() => ErrorThrowers.conflict()).toThrow(ConflictError);
			expect(() => ErrorThrowers.conflict()).toThrow("Conflict");
		});

		it("should throw ConflictError with custom message", () => {
			const customMessage = "Email já cadastrado";
			expect(() => ErrorThrowers.conflict(customMessage)).toThrow(ConflictError);
			expect(() => ErrorThrowers.conflict(customMessage)).toThrow(customMessage);
		});
	});

	describe("unprocessableEntity", () => {
		it("should throw UnprocessableEntityError with default message", () => {
			expect(() => ErrorThrowers.unprocessableEntity()).toThrow(UnprocessableEntityError);
			expect(() => ErrorThrowers.unprocessableEntity()).toThrow("Unprocessable entity");
		});

		it("should throw UnprocessableEntityError with custom message", () => {
			const customMessage = "Dados de validação inválidos";
			expect(() => ErrorThrowers.unprocessableEntity(customMessage)).toThrow(UnprocessableEntityError);
			expect(() => ErrorThrowers.unprocessableEntity(customMessage)).toThrow(customMessage);
		});
	});

	describe("tooManyRequests", () => {
		it("should throw TooManyRequestsError with default message", () => {
			expect(() => ErrorThrowers.tooManyRequests()).toThrow(TooManyRequestsError);
			expect(() => ErrorThrowers.tooManyRequests()).toThrow("Too many requests");
		});

		it("should throw TooManyRequestsError with custom message", () => {
			const customMessage = "Limite excedido";
			expect(() => ErrorThrowers.tooManyRequests(customMessage)).toThrow(TooManyRequestsError);
			expect(() => ErrorThrowers.tooManyRequests(customMessage)).toThrow(customMessage);
		});
	});

	describe("internalServer", () => {
		it("should throw InternalServerError with default message", () => {
			expect(() => ErrorThrowers.internalServer()).toThrow(InternalServerError);
			expect(() => ErrorThrowers.internalServer()).toThrow("Internal server error");
		});

		it("should throw InternalServerError with custom message", () => {
			const customMessage = "Erro no banco de dados";
			expect(() => ErrorThrowers.internalServer(customMessage)).toThrow(InternalServerError);
			expect(() => ErrorThrowers.internalServer(customMessage)).toThrow(customMessage);
		});
	});

	describe("serviceUnavailable", () => {
		it("should throw ServiceUnavailableError with default message", () => {
			expect(() => ErrorThrowers.serviceUnavailable()).toThrow(ServiceUnavailableError);
			expect(() => ErrorThrowers.serviceUnavailable()).toThrow("Service unavailable");
		});

		it("should throw ServiceUnavailableError with custom message", () => {
			const customMessage = "Serviço em manutenção";
			expect(() => ErrorThrowers.serviceUnavailable(customMessage)).toThrow(ServiceUnavailableError);
			expect(() => ErrorThrowers.serviceUnavailable(customMessage)).toThrow(customMessage);
		});
	});
});
