import { ApplicationError } from "@/errors";
import {
	ExceptionFilter,
	Catch,
	ArgumentsHost,
	HttpStatus,
} from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";

@Catch()
export class CatchEverything implements ExceptionFilter {
	constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

	catch(exception: Error, host: ArgumentsHost): void {
		const { httpAdapter } = this.httpAdapterHost;

		const ctx = host.switchToHttp();

		const httpStatus =
			exception instanceof ApplicationError
				? exception.status
				: HttpStatus.INTERNAL_SERVER_ERROR;

		const responseBody = {
			success: false,
			error: exception.message,
		};

		httpAdapter.reply(ctx.getResponse(), responseBody, httpStatus);
	}
}
