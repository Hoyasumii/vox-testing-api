import { BadRequestError } from "./bad-request.error";
import { UnauthorizedError } from "./unauthorized.error";
import { ForbiddenError } from "./forbidden.error";
import { NotFoundError } from "./not-found.error";
import { MethodNotAllowedError } from "./method-not-allowed.error";
import { ConflictError } from "./conflict.error";
import { UnprocessableEntityError } from "./unprocessable-entity.error";
import { TooManyRequestsError } from "./too-many-requests.error";
import { InternalServerError } from "./internal-server.error";
import { ServiceUnavailableError } from "./service-unavailable.error";

export { ApplicationError } from "./application.error";
export { BadRequestError } from "./bad-request.error";
export { UnauthorizedError } from "./unauthorized.error";
export { ForbiddenError } from "./forbidden.error";
export { NotFoundError } from "./not-found.error";
export { MethodNotAllowedError } from "./method-not-allowed.error";
export { ConflictError } from "./conflict.error";
export { UnprocessableEntityError } from "./unprocessable-entity.error";
export { TooManyRequestsError } from "./too-many-requests.error";
export { InternalServerError } from "./internal-server.error";
export { ServiceUnavailableError } from "./service-unavailable.error";

export default {
	badRequest: (message?: string) => {
		throw new BadRequestError(message);
	},
	unauthorized: (message?: string) => {
		throw new UnauthorizedError(message);
	},
	forbidden: (message?: string) => {
		throw new ForbiddenError(message);
	},
	notFound: (message?: string) => {
		throw new NotFoundError(message);
	},
	methodNotAllowed: (message?: string) => {
		throw new MethodNotAllowedError(message);
	},
	conflict: (message?: string) => {
		throw new ConflictError(message);
	},
	unprocessableEntity: (message?: string) => {
		throw new UnprocessableEntityError(message);
	},
	tooManyRequests: (message?: string) => {
		throw new TooManyRequestsError(message);
	},
	internalServer: (message?: string) => {
		throw new InternalServerError(message);
	},
	serviceUnavailable: (message?: string) => {
		throw new ServiceUnavailableError(message);
	},
} as const;
