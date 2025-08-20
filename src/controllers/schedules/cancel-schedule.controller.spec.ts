import { Test, TestingModule } from "@nestjs/testing";
import { CancelScheduleController } from "./cancel-schedule.controller";
import { CancelScheduleService } from "@/services/schedule";
import { ScheduleIdParam } from "../common-dtos";

describe("CancelScheduleController", () => {
	let controller: CancelScheduleController;
	let service: CancelScheduleService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CancelScheduleController],
			providers: [
				{
					provide: CancelScheduleService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<CancelScheduleController>(CancelScheduleController);
		service = module.get<CancelScheduleService>(CancelScheduleService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o CancelScheduleService", () => {
		expect(service).toBeDefined();
	});

	describe("cancel", () => {
		it("deve chamar o service com o ID do agendamento", async () => {
			const params: ScheduleIdParam = {
				id: "valid-schedule-id"
			};

			const mockResult = {
				id: "valid-schedule-id",
				status: "cancelled",
				message: "Agendamento cancelado com sucesso"
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.cancel(params);

			expect(service.run).toHaveBeenCalledWith(params.id);
			expect(result).toEqual(mockResult);
		});

		it("deve retornar resultado do service", async () => {
			const params: ScheduleIdParam = {
				id: "schedule-id"
			};

			const expectedResult = {
				id: "schedule-id",
				status: "cancelled"
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.cancel(params);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const params: ScheduleIdParam = {
				id: "invalid-id"
			};

			const error = new Error("Schedule not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.cancel(params)).rejects.toThrow(error);
		});

		it("deve lidar com agendamento já cancelado", async () => {
			const params: ScheduleIdParam = {
				id: "already-cancelled-id"
			};

			const error = new Error("Schedule already cancelled");
			mockService.run.mockRejectedValue(error);

			await expect(controller.cancel(params)).rejects.toThrow(error);
		});
	});
});
