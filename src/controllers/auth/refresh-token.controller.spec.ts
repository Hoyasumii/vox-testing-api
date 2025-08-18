import { Test, TestingModule } from "@nestjs/testing";
import { BadRequestException, UnauthorizedException } from "@nestjs/common";
import { RefreshTokenController } from "./refresh-token.controller";
import { VerifyJwtToken, RefreshJwtToken } from "@/services/jwt";
import * as jwt from "jsonwebtoken";

describe("RefreshTokenController", () => {
	let controller: RefreshTokenController;
	let verifyJwtToken: VerifyJwtToken;
	let refreshJwtToken: RefreshJwtToken;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RefreshTokenController],
			providers: [VerifyJwtToken, RefreshJwtToken],
		}).compile();

		controller = module.get<RefreshTokenController>(RefreshTokenController);
		verifyJwtToken = module.get<VerifyJwtToken>(VerifyJwtToken);
		refreshJwtToken = module.get<RefreshJwtToken>(RefreshJwtToken);
	});

	describe("refresh", () => {
		it("deve renovar um token válido", async () => {
			// Arrange
			const validToken = jwt.sign(
				{ userId: "123" },
				process.env.JWT_PRIVATE_KEY,
				{ expiresIn: "1h" }
			);
			const newToken = "new.jwt.token";

			jest.spyOn(verifyJwtToken, "run").mockResolvedValue({ userId: "123" } as any);
			jest.spyOn(refreshJwtToken, "run").mockResolvedValue(newToken);

			// Act
			const result = await controller.refresh(validToken);

			// Assert
			expect(result).toEqual({ token: newToken });
			expect(verifyJwtToken.run).toHaveBeenCalledWith(validToken);
			expect(refreshJwtToken.run).toHaveBeenCalledWith(validToken);
		});

		it("deve rejeitar requisição sem header Authorization", async () => {
			// Act & Assert
			await expect(controller.refresh()).rejects.toThrow(
				new BadRequestException("Token de autorização é obrigatório")
			);
		});

		it("deve rejeitar token com formato inválido", async () => {
			// Arrange
			const invalidToken = "invalid.token.format";

			jest.spyOn(verifyJwtToken, "run").mockRejectedValue(
				new jwt.JsonWebTokenError("Invalid token")
			);

			// Act & Assert
			await expect(controller.refresh(invalidToken)).rejects.toThrow(
				new UnauthorizedException("Token inválido ou expirado")
			);
			expect(verifyJwtToken.run).toHaveBeenCalledWith(invalidToken);
		});

		it("deve rejeitar Authorization header vazio", async () => {
			// Arrange
			const emptyAuthorization = "";

			// Act & Assert
			await expect(controller.refresh(emptyAuthorization)).rejects.toThrow(
				new BadRequestException("Token de autorização é obrigatório")
			);
		});

		it("deve rejeitar token inválido", async () => {
			// Arrange
			const invalidToken = "invalid.jwt.token";

			jest.spyOn(verifyJwtToken, "run").mockRejectedValue(
				new jwt.JsonWebTokenError("Invalid token")
			);

			// Act & Assert
			await expect(controller.refresh(invalidToken)).rejects.toThrow(
				new UnauthorizedException("Token inválido ou expirado")
			);
			expect(verifyJwtToken.run).toHaveBeenCalledWith(invalidToken);
		});

		it("deve rejeitar token expirado", async () => {
			// Arrange
			const expiredToken = jwt.sign(
				{ userId: "123" },
				process.env.JWT_PRIVATE_KEY,
				{ expiresIn: "0s" }
			);

			jest.spyOn(verifyJwtToken, "run").mockRejectedValue(
				new jwt.TokenExpiredError("Token expired", new Date())
			);

			// Act & Assert
			await expect(controller.refresh(expiredToken)).rejects.toThrow(
				new UnauthorizedException("Token inválido ou expirado")
			);
			expect(verifyJwtToken.run).toHaveBeenCalledWith(expiredToken);
		});

		it("deve rejeitar se o serviço de refresh falhar", async () => {
			// Arrange
			const validToken = jwt.sign(
				{ userId: "123" },
				process.env.JWT_PRIVATE_KEY,
				{ expiresIn: "1h" }
			);

			jest.spyOn(verifyJwtToken, "run").mockResolvedValue({ userId: "123" } as any);
			jest.spyOn(refreshJwtToken, "run").mockRejectedValue(
				new Error("Refresh failed")
			);

			// Act & Assert
			await expect(controller.refresh(validToken)).rejects.toThrow(
				new UnauthorizedException("Token inválido ou expirado")
			);
			expect(verifyJwtToken.run).toHaveBeenCalledWith(validToken);
			expect(refreshJwtToken.run).toHaveBeenCalledWith(validToken);
		});
	});
});
