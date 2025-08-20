import { Test, TestingModule } from "@nestjs/testing";
import { GetUserDataController } from "./get-user-data.controller";
import { GetUserContentByIdService } from "@/services/users";
import { AuthenticatedRequest } from "@/types/authenticated-request.interface";
import { JwtAuthGuard } from "@/guards";

describe("GetUserDataController", () => {
	let controller: GetUserDataController;
	let service: GetUserContentByIdService;

	const mockService = {
		run: jest.fn(),
	};

	const mockJwtAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetUserDataController],
			providers: [
				{
					provide: GetUserContentByIdService,
					useValue: mockService,
				},
				{
					provide: JwtAuthGuard,
					useValue: mockJwtAuthGuard,
				},
			],
		}).overrideGuard(JwtAuthGuard).useValue(mockJwtAuthGuard).compile();

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
		it("should call service.run with user id from request", async () => {
			const req = {
				user: {
					id: "user-123",
					name: "John Doe",
					email: "john@example.com",
					type: "PATIENT" as const
				}
			} as AuthenticatedRequest;
			
			const expectedResult = { id: "user-123", name: "John Doe", email: "john@example.com" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(req);

			expect(service.run).toHaveBeenCalledWith(req.user.id);
			expect(service.run).toHaveBeenCalledTimes(1);
			expect(result).toEqual(expectedResult);
		});

		it("should handle service errors", async () => {
			const req = {
				user: {
					id: "user-123",
					name: "John Doe",
					email: "john@example.com",
					type: "PATIENT" as const
				}
			} as AuthenticatedRequest;
			
			const error = new Error("User not found");
			
			mockService.run.mockRejectedValue(error);

			await expect(controller.get(req)).rejects.toThrow(error);
			expect(service.run).toHaveBeenCalledWith(req.user.id);
		});

		it("should work with different user types", async () => {
			const req = {
				user: {
					id: "doctor-456",
					name: "Dr. Smith",
					email: "dr.smith@example.com",
					type: "DOCTOR" as const
				}
			} as AuthenticatedRequest;
			
			const expectedResult = { id: "doctor-456", name: "Dr. Smith", email: "dr.smith@example.com" };
			
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(req);

			expect(service.run).toHaveBeenCalledWith(req.user.id);
			expect(result).toEqual(expectedResult);
		});
	});
});
