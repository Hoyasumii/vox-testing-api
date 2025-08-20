import { Test, TestingModule } from "@nestjs/testing";
import { DeleteDoctorAvailabilityByIdController } from "./delete-doctor-availability-by-id.controller";
import { DeleteDoctorAvailabilityByIdService } from "@/services/doctors-availability";
import { DoctorAvailabilityIdParam } from "../common-dtos";

describe("DeleteDoctorAvailabilityByIdController", () => {
	let controller: DeleteDoctorAvailabilityByIdController;
	let service: DeleteDoctorAvailabilityByIdService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DeleteDoctorAvailabilityByIdController],
			providers: [
				{
					provide: DeleteDoctorAvailabilityByIdService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<DeleteDoctorAvailabilityByIdController>(DeleteDoctorAvailabilityByIdController);
		service = module.get<DeleteDoctorAvailabilityByIdService>(DeleteDoctorAvailabilityByIdService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o DeleteDoctorAvailabilityByIdService", () => {
		expect(service).toBeDefined();
	});

	describe("delete", () => {
		it("deve chamar o service com o ID da disponibilidade", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "valid-availability-id"
			};

			const mockResult = {
				id: "valid-availability-id",
				message: "Disponibilidade deletada com sucesso"
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.delete(availabilityIdParam);

			expect(service.run).toHaveBeenCalledWith(availabilityIdParam.id);
			expect(result).toEqual(mockResult);
		});

		it("deve retornar resultado do service", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "availability-id"
			};

			const expectedResult = {
				message: "Deleted successfully"
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.delete(availabilityIdParam);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "invalid-availability-id"
			};

			const error = new Error("Availability not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(availabilityIdParam)).rejects.toThrow(error);
		});

		it("deve lidar com ID vazio", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: ""
			};

			const error = new Error("Invalid availability ID");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(availabilityIdParam)).rejects.toThrow(error);
		});

		it("deve lidar com disponibilidade que não pode ser deletada", async () => {
			const availabilityIdParam: DoctorAvailabilityIdParam = {
				id: "protected-availability-id"
			};

			const error = new Error("Cannot delete availability with scheduled appointments");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(availabilityIdParam)).rejects.toThrow(error);
		});
	});
});
