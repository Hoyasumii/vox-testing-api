import { Test, TestingModule } from "@nestjs/testing";
import { GetSchedulesByUserController } from "./get-schedules-by-user.controller";
import { GetScheduleByPatientIdService } from "@/services/schedule";
import { AuthorizationHeader } from "../common-dtos";

describe("GetSchedulesByUserController", () => {
	let controller: GetSchedulesByUserController;
	let service: GetScheduleByPatientIdService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetSchedulesByUserController],
			providers: [
				{
					provide: GetScheduleByPatientIdService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<GetSchedulesByUserController>(GetSchedulesByUserController);
		service = module.get<GetScheduleByPatientIdService>(GetScheduleByPatientIdService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o GetScheduleByPatientIdService", () => {
		expect(service).toBeDefined();
	});

	describe("get", () => {
		it("deve chamar o service com o token de autorização", async () => {
			const headers: AuthorizationHeader = {
				authorization: "Bearer valid-token"
			};

			const mockSchedules = [
				{
					id: "schedule-1",
					patientId: "patient-1",
					doctorId: "doctor-1",
					date: new Date(),
					status: "scheduled"
				}
			];

			mockService.run.mockResolvedValue(mockSchedules);

			const result = await controller.get(headers);

			expect(service.run).toHaveBeenCalledWith(headers.authorization);
			expect(result).toEqual(mockSchedules);
		});

		it("deve retornar resultado do service", async () => {
			const headers: AuthorizationHeader = {
				authorization: "Bearer valid-token"
			};

			const expectedResult = [];
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(headers);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const headers: AuthorizationHeader = {
				authorization: "Bearer invalid-token"
			};

			const error = new Error("Service error");
			mockService.run.mockRejectedValue(error);

			await expect(controller.get(headers)).rejects.toThrow(error);
		});
	});
});
