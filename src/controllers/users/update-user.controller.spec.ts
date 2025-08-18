import { Test, TestingModule } from "@nestjs/testing";
import { UpdateUserController } from "./update-user.controller";
import { UpdateUserService } from "@/services/users";
import type { UpdateUserDTO } from "@/dtos/users";

describe("UpdateUserController", () => {
	let controller: UpdateUserController;
	let service: UpdateUserService;

	const mockService = {
		run: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UpdateUserController],
			providers: [
				{
					provide: UpdateUserService,
					useValue: mockService,
				},
			],
		}).compile();

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
		it("should call service.run with id and data", async () => {
			const id = "Bearer token123";
			const data: UpdateUserDTO = {
				name: "John Doe Updated",
				email: "john.updated@example.com",
			};
			const expectedResult = { success: true, message: "User updated successfully" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(id, data);

			expect(service.run).toHaveBeenCalledWith({ id, data });
			expect(service.run).toHaveBeenCalledTimes(1);
			expect(result).toEqual(expectedResult);
		});

		it("should handle service errors", async () => {
			const id = "Bearer token123";
			const data: UpdateUserDTO = {
				name: "John Doe Updated",
			};
			const error = new Error("User not found");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.update(id, data)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith({ id, data });
		});

		it("should handle empty data object", async () => {
			const id = "Bearer token123";
			const data: UpdateUserDTO = {};
			const expectedResult = { success: true, message: "No changes made" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(id, data);

			expect(service.run).toHaveBeenCalledWith({ id, data });
			expect(result).toEqual(expectedResult);
		});

		it("should handle partial data updates", async () => {
			const id = "Bearer token123";
			const data: UpdateUserDTO = {
				email: "newemail@example.com",
			};
			const expectedResult = { success: true, message: "User updated successfully" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(id, data);

			expect(service.run).toHaveBeenCalledWith({ id, data });
			expect(result).toEqual(expectedResult);
		});

		it("should handle password updates", async () => {
			const id = "Bearer token123";
			const data: UpdateUserDTO = {
				password: "NewPassword123!",
			};
			const expectedResult = { success: true, message: "Password updated successfully" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(id, data);

			expect(service.run).toHaveBeenCalledWith({ id, data });
			expect(result).toEqual(expectedResult);
		});
	});
});
