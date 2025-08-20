import { Test, TestingModule } from "@nestjs/testing";
import { CreateDoctorAvailabilityController } from "./create-doctor-availability.controller";
import { CreateDoctorAvailabilityService } from "@/services/doctors-availability";
import { CreateDoctorAvailabilityBody } from "./create-doctor-availability.controller";
import { DoctorIdParam } from "../common-dtos";

describe("CreateDoctorAvailabilityController", () => {
	let controller: CreateDoctorAvailabilityController;
	let createDoctorAvailabilityService: CreateDoctorAvailabilityService;

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
			],
		}).compile();

		controller = module.get<CreateDoctorAvailabilityController>(CreateDoctorAvailabilityController);
		createDoctorAvailabilityService = module.get<CreateDoctorAvailabilityService>(CreateDoctorAvailabilityService);
	});

	describe("create", () => {
		it("deve criar uma disponibilidade de médico com sucesso", async () => {
			// Arrange
			const params: DoctorIdParam = { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" };
			const body: Omit<CreateDoctorAvailabilityBody, "doctorId"> = {
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			const expectedResult = true;

			jest.spyOn(createDoctorAvailabilityService, "run").mockResolvedValue(expectedResult);

			// Act
			const result = await controller.create(params, body as CreateDoctorAvailabilityBody);

			// Assert
			expect(result).toBe(expectedResult);
			expect(createDoctorAvailabilityService.run).toHaveBeenCalledWith({
				...body,
				doctorId: params.id,
			});
			expect(createDoctorAvailabilityService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro do service quando falhar", async () => {
			// Arrange
			const params: DoctorIdParam = { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" };
			const body: Omit<CreateDoctorAvailabilityBody, "doctorId"> = {
				dayOfWeek: 1,
				startHour: 9,
				endHour: 17,
			};

			const expectedError = new Error("Médico não encontrado");

			jest.spyOn(createDoctorAvailabilityService, "run").mockRejectedValue(expectedError);

			// Act & Assert
			await expect(controller.create(params, body as CreateDoctorAvailabilityBody))
				.rejects.toThrow(expectedError);

			expect(createDoctorAvailabilityService.run).toHaveBeenCalledWith({
				...body,
				doctorId: params.id,
			});
			expect(createDoctorAvailabilityService.run).toHaveBeenCalledTimes(1);
		});

		it("deve retornar erro quando endHour for menor que startHour", async () => {
			// Arrange
			const params: DoctorIdParam = { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" };
			const body: Omit<CreateDoctorAvailabilityBody, "doctorId"> = {
				dayOfWeek: 1,
				startHour: 17,
				endHour: 9, // hora final antes da inicial
			};

			const expectedError = new Error("End hour must be greater than start hour");

			jest.spyOn(createDoctorAvailabilityService, "run").mockRejectedValue(expectedError);

			// Act & Assert
			await expect(controller.create(params, body as CreateDoctorAvailabilityBody))
				.rejects.toThrow(expectedError);

			expect(createDoctorAvailabilityService.run).toHaveBeenCalledWith({
				...body,
				doctorId: params.id,
			});
			expect(createDoctorAvailabilityService.run).toHaveBeenCalledTimes(1);
		});
	});
});
