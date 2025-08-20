import { Test, TestingModule } from "@nestjs/testing";
import { DeleteUserController } from "./delete-user.controller";
import { DeleteUserService } from "@/services/users";
import { AuthenticatedRequest } from "@/types/authenticated-request.interface";
import { JwtAuthGuard } from "@/guards";

describe("DeleteUserController", () => {
	let controller: DeleteUserController;
	let service: DeleteUserService;

	const mockService = {
		run: jest.fn(),
	};

	const mockJwtAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DeleteUserController],
			providers: [
				{
					provide: DeleteUserService,
					useValue: mockService,
				},
				{
					provide: JwtAuthGuard,
					useValue: mockJwtAuthGuard,
				},
			],
		}).overrideGuard(JwtAuthGuard).useValue(mockJwtAuthGuard).compile();

		controller = module.get<DeleteUserController>(DeleteUserController);
		service = module.get<DeleteUserService>(DeleteUserService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("remove", () => {
		it("should call service.run with user id from authenticated request", async () => {
			const userId = "user123";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const expectedResult = { success: true, message: "User deleted successfully" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.remove(request);

			expect(service.run).toHaveBeenCalledWith(userId);
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
			const error = new Error("User not found");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.remove(request)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith(userId);
		});

		it("should handle unauthorized requests", async () => {
			const userId = "user123";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const error = new Error("Unauthorized");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.remove(request)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith(userId);
		});

		it("should handle invalid user id", async () => {
			const userId = "";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const error = new Error("Invalid user id");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.remove(request)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith(userId);
		});

		it("should return success result when user is deleted", async () => {
			const userId = "user123";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "test@example.com",
					name: "Test User",
					type: "PATIENT",
				},
			} as AuthenticatedRequest;
			const expectedResult = { 
				success: true, 
				message: "User deleted successfully",
				deletedAt: new Date().toISOString(),
			};
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.remove(request);

			expect(service.run).toHaveBeenCalledWith(userId);
			expect(result).toEqual(expectedResult);
		});
	});
});
