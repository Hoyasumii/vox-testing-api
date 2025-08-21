import { Test, TestingModule } from "@nestjs/testing";
import { GetSchedulesByUserController } from "./get-schedules-by-user.controller";
import { GetScheduleByPatientIdService, GetScheduleByDoctorIdService } from "@/services/schedule";
import type { AuthenticatedRequest } from "@/types";

// Mock do JwtAuthGuard para evitar dependências
jest.mock("@/guards", () => ({
	JwtAuthGuard: jest.fn().mockImplementation(() => ({
		canActivate: jest.fn().mockReturnValue(true)
	}))
}));

describe("GetSchedulesByUserController", () => {
	let controller: GetSchedulesByUserController;
	let patientService: GetScheduleByPatientIdService;
	let doctorService: GetScheduleByDoctorIdService;

	const mockPatientService = {
		run: jest.fn()
	};

	const mockDoctorService = {
		run: jest.fn()
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetSchedulesByUserController],
			providers: [
				{
					provide: GetScheduleByPatientIdService,
					useValue: mockPatientService
				},
				{
					provide: GetScheduleByDoctorIdService,
					useValue: mockDoctorService
				}
			]
		})
		.overrideGuard(require("@/guards").JwtAuthGuard)
		.useValue({ canActivate: jest.fn().mockReturnValue(true) })
		.compile();

		controller = module.get<GetSchedulesByUserController>(GetSchedulesByUserController);
		patientService = module.get<GetScheduleByPatientIdService>(GetScheduleByPatientIdService);
		doctorService = module.get<GetScheduleByDoctorIdService>(GetScheduleByDoctorIdService);
	});

	afterEach(() => {
		jest.clearAllMocks();
	});

	it("deve ser definido", () => {
		expect(controller).toBeDefined();
	});

	it("deve injetar ambos os serviços", () => {
		expect(patientService).toBeDefined();
		expect(doctorService).toBeDefined();
	});

	describe("get", () => {
		it("deve chamar o serviço de paciente para usuário PATIENT", async () => {
			const req: AuthenticatedRequest = {
				user: {
					id: "patient-123",
					name: "João Silva",
					email: "joao@email.com",
					type: "PATIENT"
				}
			} as AuthenticatedRequest;

			const mockSchedules = [
				{
					id: "schedule-1",
					patientId: "patient-123",
					doctorId: "doctor-1",
					scheduledAt: new Date(),
					status: "SCHEDULED"
				}
			];

			mockPatientService.run.mockResolvedValue(mockSchedules);

			const result = await controller.get(req);

			expect(patientService.run).toHaveBeenCalledWith("patient-123");
			expect(doctorService.run).not.toHaveBeenCalled();
			expect(result).toEqual(mockSchedules);
		});

		it("deve chamar o serviço de médico para usuário DOCTOR", async () => {
			const req: AuthenticatedRequest = {
				user: {
					id: "doctor-456",
					name: "Dr. Maria",
					email: "maria@clinic.com",
					type: "DOCTOR"
				}
			} as AuthenticatedRequest;

			const mockSchedules = [
				{
					id: "schedule-2",
					patientId: "patient-1",
					doctorId: "doctor-456",
					scheduledAt: new Date(),
					status: "SCHEDULED"
				}
			];

			mockDoctorService.run.mockResolvedValue(mockSchedules);

			const result = await controller.get(req);

			expect(doctorService.run).toHaveBeenCalledWith("doctor-456");
			expect(patientService.run).not.toHaveBeenCalled();
			expect(result).toEqual(mockSchedules);
		});

		it("deve propagar erros do serviço de paciente", async () => {
			const req: AuthenticatedRequest = {
				user: {
					id: "patient-123",
					name: "João Silva",
					email: "joao@email.com",
					type: "PATIENT"
				}
			} as AuthenticatedRequest;

			const error = new Error("Service error");
			mockPatientService.run.mockRejectedValue(error);

			await expect(controller.get(req)).rejects.toThrow(error);
		});

		it("deve propagar erros do serviço de médico", async () => {
			const req: AuthenticatedRequest = {
				user: {
					id: "doctor-456",
					name: "Dr. Maria",
					email: "maria@clinic.com",
					type: "DOCTOR"
				}
			} as AuthenticatedRequest;

			const error = new Error("Doctor service error");
			mockDoctorService.run.mockRejectedValue(error);

			await expect(controller.get(req)).rejects.toThrow(error);
		});
	});
});
