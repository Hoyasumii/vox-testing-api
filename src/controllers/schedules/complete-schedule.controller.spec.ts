import { Test, TestingModule } from "@nestjs/testing";
import { CompleteScheduleController } from "./complete-schedule.controller";
import { CompleteScheduleService } from "@/services/schedule";
import { ScheduleIdParam } from "../common-dtos";

describe("CompleteScheduleController", () => {
	let controller: CompleteScheduleController;
	let service: CompleteScheduleService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CompleteScheduleController],
			providers: [
				{
					provide: CompleteScheduleService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<CompleteScheduleController>(CompleteScheduleController);
		service = module.get<CompleteScheduleService>(CompleteScheduleService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o CompleteScheduleService", () => {
		expect(service).toBeDefined();
	});

	describe("complete", () => {
		it("deve chamar o service com o ID do agendamento", async () => {
			const params: ScheduleIdParam = {
				id: "valid-schedule-id"
			};

			const mockResult = {
				id: "valid-schedule-id",
				status: "completed",
				message: "Agendamento marcado como concluído"
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.complete(params);

			expect(service.run).toHaveBeenCalledWith(params.id);
			expect(result).toEqual(mockResult);
		});

		it("deve retornar resultado do service", async () => {
			const params: ScheduleIdParam = {
				id: "schedule-id"
			};

			const expectedResult = {
				id: "schedule-id",
				status: "completed"
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.complete(params);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const params: ScheduleIdParam = {
				id: "invalid-id"
			};

			const error = new Error("Schedule not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.complete(params)).rejects.toThrow(error);
		});

		it("deve lidar com agendamento já concluído", async () => {
			const params: ScheduleIdParam = {
				id: "already-completed-id"
			};

			const error = new Error("Schedule already completed");
			mockService.run.mockRejectedValue(error);

			await expect(controller.complete(params)).rejects.toThrow(error);
		});

		it("deve lidar com permissão negada", async () => {
			const params: ScheduleIdParam = {
				id: "schedule-id"
			};

			const error = new Error("Unauthorized");
			mockService.run.mockRejectedValue(error);

			await expect(controller.complete(params)).rejects.toThrow(error);
		});
	});
});
