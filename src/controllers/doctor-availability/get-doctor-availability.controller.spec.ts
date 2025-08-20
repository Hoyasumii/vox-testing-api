import { Test, TestingModule } from "@nestjs/testing";
import { GetDoctorAvailabilityController } from "./get-doctor-availability.controller";
import { FindByDoctorIdService } from "@/services/doctors-availability";
import { DoctorIdParam } from "../common-dtos";

describe("GetDoctorAvailabilityController", () => {
	let controller: GetDoctorAvailabilityController;
	let findByDoctorIdService: FindByDoctorIdService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [GetDoctorAvailabilityController],
			providers: [
				{
					provide: FindByDoctorIdService,
					useValue: {
						run: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<GetDoctorAvailabilityController>(GetDoctorAvailabilityController);
		findByDoctorIdService = module.get<FindByDoctorIdService>(FindByDoctorIdService);
	});

	describe("get", () => {
		it("deve retornar todas as disponibilidades de um médico", async () => {
			// Arrange
			const params: DoctorIdParam = { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" };

			const expectedResult = [
				{
					id: "availability-1",
					doctorId: params.id,
					dayOfWeek: 1,
					startHour: 9,
					endHour: 17,
					isAvailable: true,
					availableDate: new Date("2025-08-20T00:00:00Z"),
				},
				{
					id: "availability-2",
					doctorId: params.id,
					dayOfWeek: 2,
					startHour: 8,
					endHour: 16,
					isAvailable: true,
					availableDate: new Date("2025-08-21T00:00:00Z"),
				},
			];

			jest.spyOn(findByDoctorIdService, "run").mockResolvedValue(expectedResult);

			// Act
			const result = await controller.get(params);

			// Assert
			expect(result).toBe(expectedResult);
			expect(findByDoctorIdService.run).toHaveBeenCalledWith(params.id);
			expect(findByDoctorIdService.run).toHaveBeenCalledTimes(1);
		});

		it("deve retornar array vazio quando médico não tem disponibilidades", async () => {
			// Arrange
			const params: DoctorIdParam = { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" };
			const expectedResult: any[] = [];

			jest.spyOn(findByDoctorIdService, "run").mockResolvedValue(expectedResult);

			// Act
			const result = await controller.get(params);

			// Assert
			expect(result).toBe(expectedResult);
			expect(findByDoctorIdService.run).toHaveBeenCalledWith(params.id);
			expect(findByDoctorIdService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro do service quando falhar", async () => {
			// Arrange
			const params: DoctorIdParam = { id: "f47ac10b-58cc-4372-a567-0e02b2c3d479" };
			const expectedError = new Error("Médico não encontrado");

			jest.spyOn(findByDoctorIdService, "run").mockRejectedValue(expectedError);

			// Act & Assert
			await expect(controller.get(params))
				.rejects.toThrow(expectedError);

			expect(findByDoctorIdService.run).toHaveBeenCalledWith(params.id);
			expect(findByDoctorIdService.run).toHaveBeenCalledTimes(1);
		});
	});
});
