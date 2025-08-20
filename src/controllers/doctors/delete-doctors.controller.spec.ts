import { Test, TestingModule } from "@nestjs/testing";
import { DeleteDoctorsController } from "./delete-doctors.controller";
import { DeleteDoctorService } from "@/services/doctors";
import { AuthorizationHeader } from "../common-dtos";

describe("DeleteDoctorsController", () => {
	let controller: DeleteDoctorsController;
	let service: DeleteDoctorService;

	const mockService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [DeleteDoctorsController],
			providers: [
				{
					provide: DeleteDoctorService,
					useValue: mockService
				}
			]
		}).compile();

		controller = module.get<DeleteDoctorsController>(DeleteDoctorsController);
		service = module.get<DeleteDoctorService>(DeleteDoctorService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar o DeleteDoctorService", () => {
		expect(service).toBeDefined();
	});

	describe("delete", () => {
		it("deve chamar o service com o token de autorização", async () => {
			const headers: AuthorizationHeader = {
				authorization: "Bearer valid-doctor-token"
			};

			const mockResult = {
				message: "Perfil de médico deletado com sucesso",
				doctorId: "doctor-id"
			};

			mockService.run.mockResolvedValue(mockResult);

			const result = await controller.delete(headers);

			expect(service.run).toHaveBeenCalledWith(headers.authorization);
			expect(result).toEqual(mockResult);
		});

		it("deve retornar resultado do service", async () => {
			const headers: AuthorizationHeader = {
				authorization: "Bearer valid-token"
			};

			const expectedResult = {
				message: "Doctor profile deleted successfully"
			};

			mockService.run.mockResolvedValue(expectedResult);

			const result = await controller.delete(headers);

			expect(result).toBe(expectedResult);
		});

		it("deve propagar erros do service", async () => {
			const headers: AuthorizationHeader = {
				authorization: "Bearer invalid-token"
			};

			const error = new Error("Invalid token");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(headers)).rejects.toThrow(error);
		});

		it("deve lidar com token de usuário não médico", async () => {
			const headers: AuthorizationHeader = {
				authorization: "Bearer patient-token"
			};

			const error = new Error("User is not a doctor");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(headers)).rejects.toThrow(error);
		});

		it("deve lidar com token expirado", async () => {
			const headers: AuthorizationHeader = {
				authorization: "Bearer expired-token"
			};

			const error = new Error("Token expired");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(headers)).rejects.toThrow(error);
		});

		it("deve lidar com headers sem authorization", async () => {
			const headers = {} as AuthorizationHeader;

			const error = new Error("Authorization header is required");
			mockService.run.mockRejectedValue(error);

			await expect(controller.delete(headers)).rejects.toThrow(error);
		});
	});
});
