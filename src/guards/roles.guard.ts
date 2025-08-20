import { Injectable, CanActivate, ExecutionContext, ForbiddenException, SetMetadata } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export type UserType = 'DOCTOR' | 'PATIENT';

export const ROLES_KEY = 'roles';
export const Roles = (...roles: UserType[]) => SetMetadata(ROLES_KEY, roles);

@Injectable()
export class RolesGuard implements CanActivate {
	constructor(private reflector: Reflector) {}

	canActivate(context: ExecutionContext): boolean {
		const requiredRoles = this.reflector.getAllAndOverride<UserType[]>(ROLES_KEY, [
			context.getHandler(),
			context.getClass(),
		]);

		if (!requiredRoles) {
			return true;
		}

		const { user } = context.switchToHttp().getRequest();
		
		if (!user) {
			throw new ForbiddenException('Usuário não autenticado');
		}

		const hasRole = requiredRoles.some((role) => user.type === role);
		
		if (!hasRole) {
			throw new ForbiddenException('Você não tem permissão para acessar este recurso');
		}

		return true;
	}
}
