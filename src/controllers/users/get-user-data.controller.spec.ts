import { Test, TestingModule } from "@nestjs/testing";
import { GetUserDataController } from "./get-user-data.controller";
import { GetUserContentByIdService } from "@/services/users";

describe("GetUserDataController", () => {
	let controller: GetUserDataController;
	let service: GetUserContentByIdService;

	const mockService = {
		run: jest.fn(),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetUserDataController],
			providers: [
				{
					provide: GetUserContentByIdService,
					useValue: mockService,
				},
			],
		}).compile();

		controller = module.get<GetUserDataController>(GetUserDataController);
		service = module.get<GetUserContentByIdService>(GetUserContentByIdService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("should be defined", () => {
		expect(controller).toBeDefined();
	});

	describe("get", () => {
		it("should call service.run with authorization header", async () => {
			const authorization = "Bearer token123";
			const expectedResult = { id: "1", name: "John Doe", email: "john@example.com" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(authorization);

			expect(service.run).toHaveBeenCalledWith(authorization);
			expect(service.run).toHaveBeenCalledTimes(1);
			expect(result).toEqual(expectedResult);
		});

		it("should handle service errors", async () => {
			const authorization = "Bearer token123";
			const error = new Error("User not found");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.get(authorization)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith(authorization);
		});

		it("should handle empty authorization", async () => {
			const authorization = "";
			const expectedResult = null;
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(authorization);

			expect(service.run).toHaveBeenCalledWith(authorization);
			expect(result).toEqual(expectedResult);
		});
	});
});
