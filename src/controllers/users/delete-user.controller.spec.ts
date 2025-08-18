import { Test, TestingModule } from "@nestjs/testing";
import { DeleteUserController } from "./delete-user.controller";
import { DeleteUserService } from "@/services/users";

describe("DeleteUserController", () => {
	let controller: DeleteUserController;
	let service: DeleteUserService;

	const mockService = {
		run: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DeleteUserController],
			providers: [
				{
					provide: DeleteUserService,
					useValue: mockService,
				},
			],
		}).compile();

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
		it("should call service.run with authorization header", async () => {
			const authorization = "Bearer token123";
			const expectedResult = { success: true, message: "User deleted successfully" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.remove(authorization);

			expect(service.run).toHaveBeenCalledWith(authorization);
			expect(service.run).toHaveBeenCalledTimes(1);
			expect(result).toEqual(expectedResult);
		});

		it("should handle service errors", async () => {
			const authorization = "Bearer token123";
			const error = new Error("User not found");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.remove(authorization)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith(authorization);
		});

		it("should handle unauthorized requests", async () => {
			const authorization = "";
			const error = new Error("Unauthorized");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.remove(authorization)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith(authorization);
		});

		it("should handle invalid token format", async () => {
			const authorization = "InvalidToken";
			const error = new Error("Invalid token format");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.remove(authorization)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith(authorization);
		});

		it("should return success result when user is deleted", async () => {
			const authorization = "Bearer validtoken123";
			const expectedResult = { 
				success: true, 
				message: "User deleted successfully",
				deletedAt: new Date().toISOString(),
			};
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.remove(authorization);

			expect(service.run).toHaveBeenCalledWith(authorization);
			expect(result).toEqual(expectedResult);
		});
	});
});
