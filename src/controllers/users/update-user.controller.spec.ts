import { Test, TestingModule } from "@nestjs/testing";
import { UpdateUserController } from "./update-user.controller";
import { UpdateUserService } from "@/services/users";
import { UpdateUserDTO } from "@/dtos/users";
import { AuthenticatedRequest } from "@/types/authenticated-request.interface";
import { JwtAuthGuard } from "@/guards";

describe("UpdateUserController", () => {
	let controller: UpdateUserController;
	let service: UpdateUserService;

	const mockService = {
		run: jest.fn(),
	};

	const mockJwtAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UpdateUserController],
			providers: [
				{
					provide: UpdateUserService,
					useValue: mockService,
				},
				{
					provide: JwtAuthGuard,
					useValue: mockJwtAuthGuard,
				},
			],
		}).overrideGuard(JwtAuthGuard).useValue(mockJwtAuthGuard).compile();

		controller = module.get<UpdateUserController>(UpdateUserController);
		service = module.get<UpdateUserService>(UpdateUserService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("update", () => {
		it("should call service.run with user id and data", async () => {
			const userId = "user123";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const data: UpdateUserDTO = {
				name: "John Doe Updated",
				email: "john.updated@example.com",
			};
			const expectedResult = { success: true, message: "User updated successfully" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(request, data);

			expect(service.run).toHaveBeenCalledWith({ id: userId, data });
			expect(service.run).toHaveBeenCalledTimes(1);
			expect(result).toEqual(expectedResult);
		});

		it("should handle service errors", async () => {
			const userId = "user123";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const data: UpdateUserDTO = {
				name: "John Doe Updated",
			};
			const error = new Error("User not found");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.update(request, data)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith({ id: userId, data });
		});

		it("should handle empty data object", async () => {
			const userId = "user123";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const data: UpdateUserDTO = {};
			const expectedResult = { success: true, message: "No changes made" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(request, data);

			expect(service.run).toHaveBeenCalledWith({ id: userId, data });
			expect(result).toEqual(expectedResult);
		});

		it("should handle partial data updates", async () => {
			const userId = "user123";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const data: UpdateUserDTO = {
				email: "newemail@example.com",
			};
			const expectedResult = { success: true, message: "User updated successfully" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(request, data);

			expect(service.run).toHaveBeenCalledWith({ id: userId, data });
			expect(result).toEqual(expectedResult);
		});

		it("should handle password updates", async () => {
			const userId = "user123";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const data: UpdateUserDTO = {
				password: "NewPassword123!",
			};
			const expectedResult = { success: true, message: "Password updated successfully" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(request, data);

			expect(service.run).toHaveBeenCalledWith({ id: userId, data });
			expect(result).toEqual(expectedResult);
		});
	});
});
