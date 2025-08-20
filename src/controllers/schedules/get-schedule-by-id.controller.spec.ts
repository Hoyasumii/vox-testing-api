import { Test, TestingModule } from "@nestjs/testing";
import { GetScheduleByIdController } from "./get-schedule-by-id.controller";
import { GetScheduleByIdService } from "@/services/schedule";
import { ScheduleIdParam } from "../common-dtos";

describe("GetScheduleByIdController", () => {
	let controller: GetScheduleByIdController;
	let service: GetScheduleByIdService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetScheduleByIdController],
			providers: [
				{
					provide: GetScheduleByIdService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<GetScheduleByIdController>(GetScheduleByIdController);
		service = module.get<GetScheduleByIdService>(GetScheduleByIdService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o GetScheduleByIdService", () => {
		expect(service).toBeDefined();
	});

	describe("get", () => {
		it("deve chamar o service com o ID do agendamento", async () => {
			const params: ScheduleIdParam = {
				id: "valid-schedule-id"
			};

			const mockSchedule = {
				id: "valid-schedule-id",
				patientId: "patient-1",
				doctorId: "doctor-1",
				date: new Date(),
				status: "scheduled"
			};

			mockService.run.mockResolvedValue(mockSchedule);

			const result = await controller.get(params);

			expect(service.run).toHaveBeenCalledWith(params.id);
			expect(result).toEqual(mockSchedule);
		});

		it("deve retornar resultado do service", async () => {
			const params: ScheduleIdParam = {
				id: "schedule-id"
			};

			const expectedResult = {
				id: "schedule-id",
				patientId: "patient-1",
				doctorId: "doctor-1",
				date: new Date(),
				status: "completed"
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(params);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const params: ScheduleIdParam = {
				id: "invalid-id"
			};

			const error = new Error("Schedule not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.get(params)).rejects.toThrow(error);
		});

		it("deve lidar com ID vazio", async () => {
			const params: ScheduleIdParam = {
				id: ""
			};

			const error = new Error("Invalid ID");
			mockService.run.mockRejectedValue(error);

			await expect(controller.get(params)).rejects.toThrow(error);
		});
	});
});
