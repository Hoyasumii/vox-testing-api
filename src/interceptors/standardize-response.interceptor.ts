import {
	CallHandler,
	ExecutionContext,
	Injectable,
	NestInterceptor,
} from "@nestjs/common";
import { map, Observable } from "rxjs";

@Injectable()
export class StandardizeResponse<T> implements NestInterceptor<T, unknown> {
	intercept(_: ExecutionContext, next: CallHandler): Observable<unknown> {
		return next.handle().pipe(
			map((data) => ({
				success: true,
				data,
			})),
		);
	}
}
