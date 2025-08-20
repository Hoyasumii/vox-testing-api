import { Test, TestingModule } from "@nestjs/testing";
import { GetDoctorSchedulesController } from "./get-doctor-schedules.controller";
import { GetScheduleByDoctorIdService } from "@/services/schedule";
import { DoctorIdParam } from "../common-dtos";

describe("GetDoctorSchedulesController", () => {
	let controller: GetDoctorSchedulesController;
	let service: GetScheduleByDoctorIdService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetDoctorSchedulesController],
			providers: [
				{
					provide: GetScheduleByDoctorIdService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<GetDoctorSchedulesController>(GetDoctorSchedulesController);
		service = module.get<GetScheduleByDoctorIdService>(GetScheduleByDoctorIdService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o GetScheduleByDoctorIdService", () => {
		expect(service).toBeDefined();
	});

	describe("get", () => {
		it("deve chamar o service com o ID do médico", async () => {
			const params: DoctorIdParam = {
				id: "valid-doctor-id"
			};

			const mockSchedules = [
				{
					id: "schedule-1",
					patientId: "patient-1",
					doctorId: "valid-doctor-id",
					date: new Date(),
					status: "scheduled"
				},
				{
					id: "schedule-2",
					patientId: "patient-2",
					doctorId: "valid-doctor-id",
					date: new Date(),
					status: "completed"
				}
			];

			mockService.run.mockResolvedValue(mockSchedules);

			const result = await controller.get(params);

			expect(service.run).toHaveBeenCalledWith(params.id);
			expect(result).toEqual(mockSchedules);
		});

		it("deve retornar lista vazia quando médico não tem agendamentos", async () => {
			const params: DoctorIdParam = {
				id: "doctor-without-schedules"
			};

			const expectedResult: any[] = [];
			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(params);

			expect(result).toEqual(expectedResult);
			expect(service.run).toHaveBeenCalledWith(params.id);
		});

		it("deve propagar erros do service", async () => {
			const params: DoctorIdParam = {
				id: "invalid-doctor-id"
			};

			const error = new Error("Doctor not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.get(params)).rejects.toThrow(error);
		});

		it("deve lidar com ID vazio", async () => {
			const params: DoctorIdParam = {
				id: ""
			};

			const error = new Error("Invalid doctor ID");
			mockService.run.mockRejectedValue(error);

			await expect(controller.get(params)).rejects.toThrow(error);
		});

		it("deve retornar resultado do service", async () => {
			const params: DoctorIdParam = {
				id: "doctor-id"
			};

			const expectedResult = [
				{
					id: "schedule-1",
					patientId: "patient-1",
					doctorId: "doctor-id",
					date: new Date(),
					status: "scheduled"
				}
			];

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.get(params);

			expect(result).toBe(expectedResult);
		});
	});
});
