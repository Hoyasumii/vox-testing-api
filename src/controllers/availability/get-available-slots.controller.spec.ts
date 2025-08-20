import { Test, TestingModule } from "@nestjs/testing";
import { GetAvailableSlotsController } from "./get-available-slots.controller";
import { GetAvailableSlotsSerice } from "@/services/schedule";
import { GetAvailableSlotsQuery } from "../common-dtos";

describe("GetAvailableSlotsController", () => {
	let controller: GetAvailableSlotsController;
	let service: GetAvailableSlotsSerice;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetAvailableSlotsController],
			providers: [
				{
					provide: GetAvailableSlotsSerice,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<GetAvailableSlotsController>(GetAvailableSlotsController);
		service = module.get<GetAvailableSlotsSerice>(GetAvailableSlotsSerice);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o GetAvailableSlotsSerice", () => {
		expect(service).toBeDefined();
	});

	describe("get", () => {
		it("deve chamar o service com doctorId e date específica", async () => {
			const query: GetAvailableSlotsQuery = {
				doctorId: "valid-doctor-id",
				date: "2025-01-20"
			};

			const mockSlots = [
				{
					doctorId: "valid-doctor-id",
					date: "2025-01-20",
					startTime: "09:00",
					endTime: "10:00",
					available: true
				}
			];

			mockService.run.mockResolvedValue(mockSlots);

			const result = await controller.get(query);

			expect(service.run).toHaveBeenCalledWith({
				doctorId: query.doctorId,
				startDate: new Date("2025-01-20"),
				endDate: new Date("2025-01-20")
			});
			expect(result).toEqual(mockSlots);
		});

		it("deve chamar o service com período startDate e endDate", async () => {
			const query: GetAvailableSlotsQuery = {
				doctorId: "valid-doctor-id",
				startDate: "2025-01-20",
				endDate: "2025-01-25"
			};

			const mockSlots = [
				{
					doctorId: "valid-doctor-id",
					date: "2025-01-20",
					startTime: "09:00",
					endTime: "10:00",
					available: true
				}
			];

			mockService.run.mockResolvedValue(mockSlots);

			const result = await controller.get(query);

			expect(service.run).toHaveBeenCalledWith({
				doctorId: query.doctorId,
				startDate: new Date("2025-01-20"),
				endDate: new Date("2025-01-25")
			});
			expect(result).toEqual(mockSlots);
		});

		it("deve usar data atual quando não especificar datas", async () => {
			const query: GetAvailableSlotsQuery = {
				doctorId: "valid-doctor-id"
			};

			const mockSlots: any[] = [];
			mockService.run.mockResolvedValue(mockSlots);

			const result = await controller.get(query);

			expect(service.run).toHaveBeenCalledWith(
				expect.objectContaining({
					doctorId: query.doctorId,
					startDate: expect.any(Date),
					endDate: expect.any(Date)
				})
			);
			expect(result).toEqual(mockSlots);
		});

		it("deve retornar erro quando doctorId não for fornecido", async () => {
			const query: GetAvailableSlotsQuery = {
				date: "2025-01-20"
			};

			await expect(controller.get(query)).rejects.toThrow("doctorId is required for now");
		});

		it("deve propagar erros do service", async () => {
			const query: GetAvailableSlotsQuery = {
				doctorId: "invalid-doctor-id",
				date: "2025-01-20"
			};

			const error = new Error("Doctor not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.get(query)).rejects.toThrow(error);
		});

		it("deve lidar com query vazia exceto doctorId", async () => {
			const query: GetAvailableSlotsQuery = {
				doctorId: "valid-doctor-id"
			};

			const expectedResult: any[] = [];
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(query);

			expect(result).toBe(expectedResult);
		});
	});
});
