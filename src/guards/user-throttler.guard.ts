import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import type { Request } from 'express';

interface AuthenticatedRequest extends Request {
	user?: {
		id: string;
		email: string;
		type: string;
	};
}

/**
 * Guard de rate limiting que identifica usuários autenticados
 * Para usuários logados, usa o ID do usuário como identificador
 * Para usuários anônimos, usa o IP
 */
@Injectable()
export class UserThrottlerGuard extends ThrottlerGuard {
	protected async getTracker(req: Request): Promise<string> {
		const authenticatedReq = req as AuthenticatedRequest;
		const user = authenticatedReq.user;
		return user ? `user_${user.id}` : req.ip || 'unknown';
	}

	protected errorMessage = 'Limite de requisições excedido. Aguarde alguns momentos antes de tentar novamente.';
}
