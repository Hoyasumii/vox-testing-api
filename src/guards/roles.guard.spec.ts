import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, ForbiddenException } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { RolesGuard, Roles, UserType } from './roles.guard';

describe('RolesGuard', () => {
	let guard: RolesGuard;
	let reflector: Reflector;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
				RolesGuard,
				{
					provide: Reflector,
					useValue: {
						getAllAndOverride: jest.fn(),
					},
				},
			],
		}).compile();

		guard = module.get<RolesGuard>(RolesGuard);
		reflector = module.get<Reflector>(Reflector);
	});

	const createMockContext = (user?: any): ExecutionContext => {
		const mockRequest = { user };

		return {
			switchToHttp: () => ({
				getRequest: () => mockRequest,
			}),
			getHandler: jest.fn(),
			getClass: jest.fn(),
		} as unknown as ExecutionContext;
	};

	describe('canActivate', () => {
		it('deve permitir acesso quando nenhuma role é requerida', () => {
			// Arrange
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(null);
			const context = createMockContext();

			// Act
			const result = guard.canActivate(context);

			// Assert
			expect(result).toBe(true);
		});

		it('deve permitir acesso para usuário DOCTOR quando role DOCTOR é requerida', () => {
			// Arrange
			const requiredRoles: UserType[] = ['DOCTOR'];
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
			
			const user = { type: 'DOCTOR', id: 'doctor-123' };
			const context = createMockContext(user);

			// Act
			const result = guard.canActivate(context);

			// Assert
			expect(result).toBe(true);
		});

		it('deve permitir acesso para usuário PATIENT quando role PATIENT é requerida', () => {
			// Arrange
			const requiredRoles: UserType[] = ['PATIENT'];
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
			
			const user = { type: 'PATIENT', id: 'patient-123' };
			const context = createMockContext(user);

			// Act
			const result = guard.canActivate(context);

			// Assert
			expect(result).toBe(true);
		});

		it('deve permitir acesso quando usuário tem uma das roles múltiplas requeridas', () => {
			// Arrange
			const requiredRoles: UserType[] = ['DOCTOR', 'PATIENT'];
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
			
			const user = { type: 'DOCTOR', id: 'doctor-123' };
			const context = createMockContext(user);

			// Act
			const result = guard.canActivate(context);

			// Assert
			expect(result).toBe(true);
		});

		it('deve rejeitar acesso quando usuário não tem a role requerida', () => {
			// Arrange
			const requiredRoles: UserType[] = ['DOCTOR'];
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
			
			const user = { type: 'PATIENT', id: 'patient-123' };
			const context = createMockContext(user);

			// Act & Assert
			expect(() => guard.canActivate(context)).toThrow(
				new ForbiddenException('Você não tem permissão para acessar este recurso')
			);
		});

		it('deve rejeitar acesso quando usuário não está autenticado', () => {
			// Arrange
			const requiredRoles: UserType[] = ['DOCTOR'];
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
			
			const context = createMockContext(); // sem usuário

			// Act & Assert
			expect(() => guard.canActivate(context)).toThrow(
				new ForbiddenException('Usuário não autenticado')
			);
		});

		it('deve rejeitar acesso quando usuário é null', () => {
			// Arrange
			const requiredRoles: UserType[] = ['PATIENT'];
			jest.spyOn(reflector, 'getAllAndOverride').mockReturnValue(requiredRoles);
			
			const context = createMockContext(null);

			// Act & Assert
			expect(() => guard.canActivate(context)).toThrow(
				new ForbiddenException('Usuário não autenticado')
			);
		});
	});

	describe('Roles decorator', () => {
		it('deve criar metadata com roles corretas', () => {
			// Act
			const decorator = Roles('DOCTOR', 'PATIENT');

			// Assert
			expect(decorator).toBeDefined();
		});
	});
});
