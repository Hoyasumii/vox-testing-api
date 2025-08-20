import { Test, TestingModule } from "@nestjs/testing";
import { CreateDoctorAvailabilityController } from "./create-doctor-availability.controller";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";
import { CreateDoctorAvailabilityBody } from "./create-doctor-availability.controller";
import { DoctorIdParam } from "../common-dtos";
import { AuthenticatedRequest } from "@/types/authenticated-request.interface";
import { ForbiddenException } from "@nestjs/common";
import { JwtAuthGuard, RolesGuard } from "@/guards";

describe("CreateDoctorAvailabilityController", () => {
	let controller: CreateDoctorAvailabilityController;
	let createDoctorAvailabilityService: CreateDoctorAvailabilityService;

	const mockJwtAuthGuard = {
		canActivate: jest.fn(() => true),
	};

	const mockRolesGuard = {
		canActivate: jest.fn(() => true),
	};

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CreateDoctorAvailabilityController],
			providers: [
				{
					provide: CreateDoctorAvailabilityService,
					useValue: {
						run: jest.fn(),
					},
				},
				{
					provide: JwtAuthGuard,
					useValue: mockJwtAuthGuard,
				},
				{
					provide: RolesGuard,
					useValue: mockRolesGuard,
				},
			],
		})
		.overrideGuard(JwtAuthGuard).useValue(mockJwtAuthGuard)
		.overrideGuard(RolesGuard).useValue(mockRolesGuard)
		.compile();

		controller = module.get<CreateDoctorAvailabilityController>(CreateDoctorAvailabilityController);
		createDoctorAvailabilityService = module.get<CreateDoctorAvailabilityService>(CreateDoctorAvailabilityService);
	});

	describe("create", () => {
		it("deve criar uma disponibilidade de médico com sucesso", async () => {
			// Arrange
			const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "doctor@example.com",
					name: "Dr. Test",
					type: "DOCTOR",
				},
			} as AuthenticatedRequest;
			const params: DoctorIdParam = { id: userId };
			const body: CreateDoctorAvailabilityBody = {
				doctorId: userId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			const expectedResult = true;

			jest.spyOn(createDoctorAvailabilityService, "run").mockResolvedValue(expectedResult);

			// Act
			const result = await controller.create(request, params, body);

			// Assert
			expect(result).toBe(expectedResult);
			expect(createDoctorAvailabilityService.run).toHaveBeenCalledWith({
				doctorId: userId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			});
			expect(createDoctorAvailabilityService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro do service quando falhar", async () => {
			// Arrange
			const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "doctor@example.com",
					name: "Dr. Test",
					type: "DOCTOR",
				},
			} as AuthenticatedRequest;
			const params: DoctorIdParam = { id: userId };
			const body: CreateDoctorAvailabilityBody = {
				doctorId: userId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			const expectedError = new Error("Médico não encontrado");

			jest.spyOn(createDoctorAvailabilityService, "run").mockRejectedValue(expectedError);

			// Act & Assert
			await expect(controller.create(request, params, body))
				.rejects.toThrow(expectedError);

			expect(createDoctorAvailabilityService.run).toHaveBeenCalledWith({
				doctorId: userId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			});
			expect(createDoctorAvailabilityService.run).toHaveBeenCalledTimes(1);
		});

		it("deve retornar erro quando tentar criar disponibilidade para outro médico", async () => {
			// Arrange
			const userId = "f47ac10b-58cc-4372-a567-0e02b2c3d479";
			const otherDoctorId = "other-doctor-id";
			const request: AuthenticatedRequest = {
				user: {
					id: userId,
					email: "doctor@example.com",
					name: "Dr. Test",
					type: "DOCTOR",
				},
			} as AuthenticatedRequest;
			const params: DoctorIdParam = { id: otherDoctorId };
			const body: CreateDoctorAvailabilityBody = {
				doctorId: otherDoctorId,
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			// Act & Assert
			await expect(controller.create(request, params, body))
				.rejects.toThrow(ForbiddenException);
		});
	});
});
