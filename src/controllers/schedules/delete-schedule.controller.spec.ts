import { Test, TestingModule } from "@nestjs/testing";
import { DeleteScheduleController } from "./delete-schedule.controller";
import { DeleteScheduleService } from "@/services/schedule";
import { ScheduleIdParam } from "../common-dtos";

describe("DeleteScheduleController", () => {
	let controller: DeleteScheduleController;
	let service: DeleteScheduleService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DeleteScheduleController],
			providers: [
				{
					provide: DeleteScheduleService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<DeleteScheduleController>(DeleteScheduleController);
		service = module.get<DeleteScheduleService>(DeleteScheduleService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o DeleteScheduleService", () => {
		expect(service).toBeDefined();
	});

	describe("delete", () => {
		it("deve chamar o service com o ID do agendamento", async () => {
			const params: ScheduleIdParam = {
				id: "valid-schedule-id"
			};

			const mockResult = {
				id: "valid-schedule-id",
				message: "Agendamento deletado com sucesso"
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.delete(params);

			expect(service.run).toHaveBeenCalledWith(params.id);
			expect(result).toEqual(mockResult);
		});

		it("deve retornar resultado do service", async () => {
			const params: ScheduleIdParam = {
				id: "schedule-id"
			};

			const expectedResult = {
				message: "Deleted successfully"
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.delete(params);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const params: ScheduleIdParam = {
				id: "invalid-id"
			};

			const error = new Error("Schedule not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(params)).rejects.toThrow(error);
		});

		it("deve lidar com ID vazio", async () => {
			const params: ScheduleIdParam = {
				id: ""
			};

			const error = new Error("Invalid ID");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(params)).rejects.toThrow(error);
		});

		it("deve lidar com operação de delete falhada", async () => {
			const params: ScheduleIdParam = {
				id: "problematic-id"
			};

			const error = new Error("Delete operation failed");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(params)).rejects.toThrow(error);
		});
	});
});
