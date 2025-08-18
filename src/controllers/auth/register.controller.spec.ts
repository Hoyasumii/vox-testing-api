import { Test, TestingModule } from "@nestjs/testing";
import { RegisterController } from "./register.controller";
import { CreateUserService } from "@/services/users";
import type { CreateUserDTO } from "@/dtos/users";

describe("RegisterController", () => {
	let controller: RegisterController;
	let createUserService: CreateUserService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [RegisterController],
			providers: [
				{
					provide: CreateUserService,
					useValue: {
						run: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<RegisterController>(RegisterController);
		createUserService = module.get<CreateUserService>(CreateUserService);
	});

	describe("create", () => {
		it("deve criar um usuário com sucesso", async () => {
			// Arrange
			const createUserDto: CreateUserDTO = {
				name: "João Silva",
				email: "joao@email.com",
				password: "password123",
				type: "PATIENT",
			};

			const expectedUserId = "user-id-123";

			jest.spyOn(createUserService, "run").mockResolvedValue(expectedUserId);

			// Act
			const result = await controller.create(createUserDto);

			// Assert
			expect(result).toBe(expectedUserId);
			expect(createUserService.run).toHaveBeenCalledWith(createUserDto);
			expect(createUserService.run).toHaveBeenCalledTimes(1);
		});

		it("deve criar um usuário médico com sucesso", async () => {
			// Arrange
			const createUserDto: CreateUserDTO = {
				name: "Dr. Maria Santos",
				email: "maria@email.com",
				password: "password123",
				type: "DOCTOR",
			};

			const expectedUserId = "doctor-id-123";

			jest.spyOn(createUserService, "run").mockResolvedValue(expectedUserId);

			// Act
			const result = await controller.create(createUserDto);

			// Assert
			expect(result).toBe(expectedUserId);
			expect(createUserService.run).toHaveBeenCalledWith(createUserDto);
			expect(createUserService.run).toHaveBeenCalledTimes(1);
		});

		it("deve criar um usuário sem tipo especificado (usando default)", async () => {
			// Arrange
			const createUserDto: CreateUserDTO = {
				name: "Ana Costa",
				email: "ana@email.com",
				password: "password123",
			};

			const expectedUserId = "user-id-456";

			jest.spyOn(createUserService, "run").mockResolvedValue(expectedUserId);

			// Act
			const result = await controller.create(createUserDto);

			// Assert
			expect(result).toBe(expectedUserId);
			expect(createUserService.run).toHaveBeenCalledWith(createUserDto);
			expect(createUserService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro do serviço", async () => {
			// Arrange
			const createUserDto: CreateUserDTO = {
				name: "João Silva",
				email: "joao@email.com",
				password: "password123",
				type: "PATIENT",
			};

			const serviceError = new Error("Email já está em uso");
			jest.spyOn(createUserService, "run").mockRejectedValue(serviceError);

			// Act & Assert
			await expect(controller.create(createUserDto)).rejects.toThrow(serviceError);
			expect(createUserService.run).toHaveBeenCalledWith(createUserDto);
			expect(createUserService.run).toHaveBeenCalledTimes(1);
		});
	});
});
