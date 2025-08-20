import { Test, TestingModule } from "@nestjs/testing";
import { DoctorExistsController } from "./doctor-exists.controller";
import { DoctorExistsService } from "@/services/doctors";
import { DoctorIdParam } from "../common-dtos";

describe("DoctorExistsController", () => {
	let controller: DoctorExistsController;
	let service: DoctorExistsService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DoctorExistsController],
			providers: [
				{
					provide: DoctorExistsService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<DoctorExistsController>(DoctorExistsController);
		service = module.get<DoctorExistsService>(DoctorExistsService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o DoctorExistsService", () => {
		expect(service).toBeDefined();
	});

	describe("run", () => {
		it("deve chamar o service com o ID do médico e retornar que existe", async () => {
			const params: DoctorIdParam = {
				id: "valid-doctor-id"
			};

			const mockResult = {
				exists: true,
				doctorId: "valid-doctor-id",
				message: "Doctor exists"
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.run(params);

			expect(service.run).toHaveBeenCalledWith(params.id);
			expect(result).toEqual(mockResult);
		});

		it("deve retornar que médico não existe", async () => {
			const params: DoctorIdParam = {
				id: "non-existent-doctor-id"
			};

			const expectedResult = {
				exists: false,
				doctorId: "non-existent-doctor-id",
				message: "Doctor not found"
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.run(params);

			expect(result).toEqual(expectedResult);
			expect(service.run).toHaveBeenCalledWith(params.id);
		});

		it("deve retornar resultado do service", async () => {
			const params: DoctorIdParam = {
				id: "doctor-id"
			};

			const expectedResult = {
				exists: true,
				doctorId: "doctor-id"
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.run(params);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const params: DoctorIdParam = {
				id: "problematic-doctor-id"
			};

			const error = new Error("Database error");
			mockService.run.mockRejectedValue(error);

			await expect(controller.run(params)).rejects.toThrow(error);
		});

		it("deve lidar com ID vazio", async () => {
			const params: DoctorIdParam = {
				id: ""
			};

			const error = new Error("Invalid doctor ID");
			mockService.run.mockRejectedValue(error);

			await expect(controller.run(params)).rejects.toThrow(error);
		});

		it("deve lidar com ID mal formatado", async () => {
			const params: DoctorIdParam = {
				id: "invalid-uuid-format"
			};

			const error = new Error("Invalid UUID format");
			mockService.run.mockRejectedValue(error);

			await expect(controller.run(params)).rejects.toThrow(error);
		});
	});
});
