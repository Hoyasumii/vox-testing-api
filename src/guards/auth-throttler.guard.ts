import { Injectable } from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';

/**
 * Guard de rate limiting específico para rotas de autenticação
 * Aplica limite mais restritivo para prevenir ataques de força bruta
 */
@Injectable()
export class AuthThrottlerGuard extends ThrottlerGuard {
	protected errorMessage = 'Muitas tentativas de autenticação. Tente novamente em alguns minutos.';
}
