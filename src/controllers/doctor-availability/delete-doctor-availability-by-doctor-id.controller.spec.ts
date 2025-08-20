import { Test, TestingModule } from "@nestjs/testing";
import { DeleteDoctorAvailabilityByDoctorIdController } from "./delete-doctor-availability-by-doctor-id.controller";
import { DeleteDoctorAvailabilityByDoctorIdService } from "@/services/doctors-availability";
import { DoctorIdParam } from "../common-dtos";

describe("DeleteDoctorAvailabilityByDoctorIdController", () => {
	let controller: DeleteDoctorAvailabilityByDoctorIdController;
	let service: DeleteDoctorAvailabilityByDoctorIdService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DeleteDoctorAvailabilityByDoctorIdController],
			providers: [
				{
					provide: DeleteDoctorAvailabilityByDoctorIdService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<DeleteDoctorAvailabilityByDoctorIdController>(DeleteDoctorAvailabilityByDoctorIdController);
		service = module.get<DeleteDoctorAvailabilityByDoctorIdService>(DeleteDoctorAvailabilityByDoctorIdService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o DeleteDoctorAvailabilityByDoctorIdService", () => {
		expect(service).toBeDefined();
	});

	describe("delete", () => {
		it("deve chamar o service com o ID do médico", async () => {
			const params: DoctorIdParam = {
				id: "valid-doctor-id"
			};

			const mockResult = {
				message: "Todas as disponibilidades do médico foram deletadas",
				deletedCount: 3
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.delete(params);

			expect(service.run).toHaveBeenCalledWith(params.id);
			expect(result).toEqual(mockResult);
		});

		it("deve retornar resultado do service", async () => {
			const params: DoctorIdParam = {
				id: "doctor-id"
			};

			const expectedResult = {
				message: "Deleted successfully",
				deletedCount: 1
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.delete(params);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const params: DoctorIdParam = {
				id: "invalid-doctor-id"
			};

			const error = new Error("Doctor not found");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(params)).rejects.toThrow(error);
		});

		it("deve lidar com médico sem disponibilidades", async () => {
			const params: DoctorIdParam = {
				id: "doctor-without-availability"
			};

			const result = {
				message: "Nenhuma disponibilidade encontrada para deletar",
				deletedCount: 0
			};

			mockService.run.mockResolvedValue(result);

			const response = await controller.delete(params);

			expect(response).toEqual(result);
			expect(service.run).toHaveBeenCalledWith(params.id);
		});

		it("deve lidar com ID vazio", async () => {
			const params: DoctorIdParam = {
				id: ""
			};

			const error = new Error("Invalid doctor ID");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(params)).rejects.toThrow(error);
		});
	});
});
