import { Test, TestingModule } from "@nestjs/testing";
import { UpdateDoctorAvailabilityController, UpdateDoctorAvailabilityBody } from "./update-doctor-availability.controller";
import { UpdateDoctorAvailabilityService } from "@/services/doctors-availability";
import { DoctorAvailabilityIdParam } from "../common-dtos";

describe("UpdateDoctorAvailabilityController", () => {
	let controller: UpdateDoctorAvailabilityController;
	let service: UpdateDoctorAvailabilityService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [UpdateDoctorAvailabilityController],
			providers: [
				{
					provide: UpdateDoctorAvailabilityService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<UpdateDoctorAvailabilityController>(UpdateDoctorAvailabilityController);
		service = module.get<UpdateDoctorAvailabilityService>(UpdateDoctorAvailabilityService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o UpdateDoctorAvailabilityService", () => {
		expect(service).toBeDefined();
	});

	describe("update", () => {
		it("deve chamar o service com o ID da disponibilidade e dados de atualização", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "valid-availability-id"
			};

			const body: UpdateDoctorAvailabilityBody = {
				startHour: 9,
				endHour: 17,
				dayOfWeek: 1
			};

			const mockResult = {
				id: "valid-availability-id",
				startHour: 9,
				endHour: 17,
				dayOfWeek: 1,
				updatedAt: new Date()
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.update(availabilityIdParam, body);

			expect(service.run).toHaveBeenCalledWith({
				id: availabilityIdParam.id,
				content: body
			});
			expect(result).toEqual(mockResult);
		});

		it("deve retornar resultado do service", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "availability-id"
			};

			const body: UpdateDoctorAvailabilityBody = {
				startHour: 8,
				endHour: 16
			};

			const expectedResult = {
				id: "availability-id",
				startHour: 8,
				endHour: 16
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.update(availabilityIdParam, body);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "invalid-availability-id"
			};

			const body: UpdateDoctorAvailabilityBody = {
				startHour: 9,
				endHour: 17
			};

			const error = new Error("Availability not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.update(availabilityIdParam, body)).rejects.toThrow(error);
		});

		it("deve lidar com conflito de horários", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "availability-id"
			};

			const body: UpdateDoctorAvailabilityBody = {
				startHour: 18,
				endHour: 8 // horário inválido
			};

			const error = new Error("Invalid time range");
			mockService.run.mockRejectedValue(error);

			await expect(controller.update(availabilityIdParam, body)).rejects.toThrow(error);
		});

		it("deve lidar com dados vazios", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "availability-id"
			};

			const body: UpdateDoctorAvailabilityBody = {};

			const mockResult = {
				id: "availability-id",
				message: "No changes to update"
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.update(availabilityIdParam, body);

			expect(service.run).toHaveBeenCalledWith({
				id: availabilityIdParam.id,
				content: body
			});
			expect(result).toEqual(mockResult);
		});
	});
});
