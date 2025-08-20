import { Test, TestingModule } from '@nestjs/testing';
import { ExecutionContext, UnauthorizedException } from '@nestjs/common';
import { JwtAuthGuard } from './jwt-auth.guard';
import { VerifyJwtToken } from '@/services/jwt';
import { makeGetUserContentByIdFactory } from '@/factories/users';
import * as jwt from 'jsonwebtoken';

// Mock da factory
jest.mock('@/factories/users', () => ({
	makeGetUserContentByIdFactory: jest.fn(),
}));

describe('JwtAuthGuard', () => {
	let guard: JwtAuthGuard;
	let verifyJwtToken: VerifyJwtToken;
	let mockUserService: any;

	beforeEach(async () => {
		mockUserService = {
			run: jest.fn(),
		};

		(makeGetUserContentByIdFactory as jest.Mock).mockReturnValue(mockUserService);

		const module: TestingModule = await Test.createTestingModule({
			providers: [
				JwtAuthGuard,
				{
					provide: VerifyJwtToken,
					useValue: {
						run: jest.fn(),
					},
				},
			],
		}).compile();

		guard = module.get<JwtAuthGuard>(JwtAuthGuard);
		verifyJwtToken = module.get<VerifyJwtToken>(VerifyJwtToken);
	});

	const createMockContext = (authHeader?: string): ExecutionContext => {
		const mockRequest = {
			headers: authHeader ? { authorization: authHeader } : {},
			user: undefined,
		};

		return {
			switchToHttp: () => ({
				getRequest: () => mockRequest,
			}),
		} as ExecutionContext;
	};

	describe('canActivate', () => {
		it('deve permitir acesso com token válido', async () => {
			// Arrange
			const token = 'valid-jwt-token';
			const mockPayload = { userId: 'user-123', iat: 123456, exp: 654321 };
			const mockUser = {
				id: 'user-123',
				name: 'João Silva',
				email: 'joao@email.com',
				type: 'PATIENT',
			};

			jest.spyOn(verifyJwtToken, 'run').mockResolvedValue(mockPayload);
			mockUserService.run.mockResolvedValue(mockUser);

			const context = createMockContext(`Bearer ${token}`);

			// Act
			const result = await guard.canActivate(context);

			// Assert
			expect(result).toBe(true);
			expect(verifyJwtToken.run).toHaveBeenCalledWith(token);
			expect(mockUserService.run).toHaveBeenCalledWith('user-123');
			
			const request = context.switchToHttp().getRequest();
			expect(request.user).toEqual({
				id: 'user-123',
				name: 'João Silva',
				email: 'joao@email.com',
				type: 'PATIENT',
				userId: 'user-123',
				iat: 123456,
				exp: 654321,
			});
		});

		it('deve permitir acesso com token sem Bearer prefix', async () => {
			// Arrange
			const token = 'valid-jwt-token';
			const mockPayload = { userId: 'user-123' };
			const mockUser = {
				id: 'user-123',
				name: 'Maria Santos',
				email: 'maria@email.com',
				type: 'DOCTOR',
			};

			jest.spyOn(verifyJwtToken, 'run').mockResolvedValue(mockPayload);
			mockUserService.run.mockResolvedValue(mockUser);

			const context = createMockContext(token);

			// Act
			const result = await guard.canActivate(context);

			// Assert
			expect(result).toBe(true);
			expect(verifyJwtToken.run).toHaveBeenCalledWith(token);
		});

		it('deve rejeitar requisição sem header Authorization', async () => {
			// Arrange
			const context = createMockContext();

			// Act & Assert
			await expect(guard.canActivate(context)).rejects.toThrow(
				new UnauthorizedException('Token de autorização é obrigatório')
			);
		});

		it('deve rejeitar header Authorization vazio', async () => {
			// Arrange
			const context = createMockContext('');

			// Act & Assert
			await expect(guard.canActivate(context)).rejects.toThrow(
				new UnauthorizedException('Token de autorização é obrigatório')
			);
		});

		it('deve rejeitar Bearer sem token', async () => {
			// Arrange
			const context = createMockContext('Bearer ');

			// Act & Assert
			await expect(guard.canActivate(context)).rejects.toThrow(
				new UnauthorizedException('Token de autorização é obrigatório')
			);
		});

		it('deve rejeitar token inválido', async () => {
			// Arrange
			const invalidToken = 'invalid-token';
			jest.spyOn(verifyJwtToken, 'run').mockRejectedValue(
				new jwt.JsonWebTokenError('invalid token')
			);

			const context = createMockContext(`Bearer ${invalidToken}`);

			// Act & Assert
			await expect(guard.canActivate(context)).rejects.toThrow(
				new UnauthorizedException('Token inválido ou expirado')
			);
		});

		it('deve rejeitar token expirado', async () => {
			// Arrange
			const expiredToken = 'expired-token';
			jest.spyOn(verifyJwtToken, 'run').mockRejectedValue(
				new jwt.TokenExpiredError('token expired', new Date())
			);

			const context = createMockContext(`Bearer ${expiredToken}`);

			// Act & Assert
			await expect(guard.canActivate(context)).rejects.toThrow(
				new UnauthorizedException('Token inválido ou expirado')
			);
		});

		it('deve rejeitar quando usuário não existe', async () => {
			// Arrange
			const token = 'valid-jwt-token';
			const mockPayload = { userId: 'nonexistent-user' };

			jest.spyOn(verifyJwtToken, 'run').mockResolvedValue(mockPayload);
			mockUserService.run.mockRejectedValue(new Error('User not found'));

			const context = createMockContext(`Bearer ${token}`);

			// Act & Assert
			await expect(guard.canActivate(context)).rejects.toThrow(
				new UnauthorizedException('Token inválido ou expirado')
			);
		});
	});
});
