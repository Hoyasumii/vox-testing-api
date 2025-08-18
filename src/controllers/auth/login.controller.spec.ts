import { Test, TestingModule } from "@nestjs/testing";
import { LoginController } from "./login.controller";
import { AuthenticateUserService } from "@/services/users";
import type { AuthenticateUserDTO } from "@/dtos/users";

describe("LoginController", () => {
	let controller: LoginController;
	let authenticateUserService: AuthenticateUserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [LoginController],
			providers: [
				{
					provide: AuthenticateUserService,
					useValue: {
						run: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<LoginController>(LoginController);
		authenticateUserService = module.get<AuthenticateUserService>(AuthenticateUserService);
	});

	describe("auth", () => {
		it("deve autenticar um usuário com credenciais válidas", async () => {
			// Arrange
			const authenticateUserDto: AuthenticateUserDTO = {
				email: "joao@email.com",
				password: "password123",
			};

			const expectedToken = "jwt.token.string";

			jest.spyOn(authenticateUserService, "run").mockResolvedValue(expectedToken);

			// Act
			const result = await controller.auth(authenticateUserDto);

			// Assert
			expect(result).toBe(expectedToken);
			expect(authenticateUserService.run).toHaveBeenCalledWith(authenticateUserDto);
			expect(authenticateUserService.run).toHaveBeenCalledTimes(1);
		});

		it("deve autenticar um médico com credenciais válidas", async () => {
			// Arrange
			const authenticateUserDto: AuthenticateUserDTO = {
				email: "dra.maria@email.com",
				password: "doctorpassword123",
			};

			const expectedToken = "jwt.doctor.token.string";

			jest.spyOn(authenticateUserService, "run").mockResolvedValue(expectedToken);

			// Act
			const result = await controller.auth(authenticateUserDto);

			// Assert
			expect(result).toBe(expectedToken);
			expect(authenticateUserService.run).toHaveBeenCalledWith(authenticateUserDto);
			expect(authenticateUserService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro do serviço para credenciais inválidas", async () => {
			// Arrange
			const authenticateUserDto: AuthenticateUserDTO = {
				email: "usuario@inexistente.com",
				password: "senhaerrada",
			};

			const serviceError = new Error("Credenciais inválidas");
			jest.spyOn(authenticateUserService, "run").mockRejectedValue(serviceError);

			// Act & Assert
			await expect(controller.auth(authenticateUserDto)).rejects.toThrow(serviceError);
			expect(authenticateUserService.run).toHaveBeenCalledWith(authenticateUserDto);
			expect(authenticateUserService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro do serviço para email inválido", async () => {
			// Arrange
			const authenticateUserDto: AuthenticateUserDTO = {
				email: "email-invalido",
				password: "password123",
			};

			const serviceError = new Error("Email deve ter um formato válido");
			jest.spyOn(authenticateUserService, "run").mockRejectedValue(serviceError);

			// Act & Assert
			await expect(controller.auth(authenticateUserDto)).rejects.toThrow(serviceError);
			expect(authenticateUserService.run).toHaveBeenCalledWith(authenticateUserDto);
			expect(authenticateUserService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro do serviço para senha em branco", async () => {
			// Arrange
			const authenticateUserDto: AuthenticateUserDTO = {
				email: "joao@email.com",
				password: "",
			};

			const serviceError = new Error("Senha é obrigatória");
			jest.spyOn(authenticateUserService, "run").mockRejectedValue(serviceError);

			// Act & Assert
			await expect(controller.auth(authenticateUserDto)).rejects.toThrow(serviceError);
			expect(authenticateUserService.run).toHaveBeenCalledWith(authenticateUserDto);
			expect(authenticateUserService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro interno do serviço", async () => {
			// Arrange
			const authenticateUserDto: AuthenticateUserDTO = {
				email: "joao@email.com",
				password: "password123",
			};

			const serviceError = new Error("Erro interno do servidor");
			jest.spyOn(authenticateUserService, "run").mockRejectedValue(serviceError);

			// Act & Assert
			await expect(controller.auth(authenticateUserDto)).rejects.toThrow(serviceError);
			expect(authenticateUserService.run).toHaveBeenCalledWith(authenticateUserDto);
			expect(authenticateUserService.run).toHaveBeenCalledTimes(1);
		});
	});
});
