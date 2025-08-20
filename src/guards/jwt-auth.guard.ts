import { Injectable, CanActivate, ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { VerifyJwtToken } from '@/services/jwt';
import { makeGetUserContentByIdFactory } from '@/factories/users';

interface JwtPayload {
	userId: string;
	iat?: number;
	exp?: number;
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
	constructor(private verifyJwtToken: VerifyJwtToken) {}

	async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest();
		const authHeader = request.headers.authorization;

		if (!authHeader) {
			throw new UnauthorizedException('Token de autorização é obrigatório');
		}

		// Extrair o token do header Authorization
		const token = authHeader.startsWith('Bearer ') 
			? authHeader.substring(7) 
			: authHeader;

		if (!token || token.trim() === '') {
			throw new UnauthorizedException('Token de autorização é obrigatório');
		}

		try {
			// Verificar o token usando o serviço existente
			const payload = await this.verifyJwtToken.run<JwtPayload>(token);
			
			// Buscar os dados completos do usuário
			const userService = makeGetUserContentByIdFactory();
			const user = await userService.run(payload.userId);
			
			// Adicionar os dados completos do usuário à requisição
			request.user = {
				id: user.id,
				name: user.name,
				email: user.email,
				type: user.type,
				...payload
			};
			
			return true;
		} catch {
			throw new UnauthorizedException('Token inválido ou expirado');
		}
	}
}
