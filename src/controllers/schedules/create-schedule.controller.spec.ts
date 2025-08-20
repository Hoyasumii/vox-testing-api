import { Test, TestingModule } from "@nestjs/testing";
import { CreateScheduleController, CreateScheduleBody } from "./create-schedule.controller";
import { CreateScheduleService } from "@/services/schedule";
import { ScheduleStatus } from "@/dtos/schedules/schedule-types";

describe("CreateScheduleController", () => {
	let controller: CreateScheduleController;
	let createScheduleService: CreateScheduleService;

	beforeEach(async () => {
		const module: TestingModule = await Test.createTestingModule({
			controllers: [CreateScheduleController],
			providers: [
				{
					provide: CreateScheduleService,
					useValue: {
						run: jest.fn(),
					},
				},
			],
		}).compile();

		controller = module.get<CreateScheduleController>(CreateScheduleController);
		createScheduleService = module.get<CreateScheduleService>(CreateScheduleService);
	});

	describe("create", () => {
		it("deve criar um agendamento com sucesso", async () => {
			// Arrange
			const body: CreateScheduleBody = {
				availabilityId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
				patientId: "a47ac10b-58cc-4372-a567-0e02b2c3d480",
				doctorId: "b47ac10b-58cc-4372-a567-0e02b2c3d481",
				scheduledAt: "2025-08-20T10:00:00Z",
			};

			const expectedResult = {
				id: "schedule-uuid",
				availabilityId: body.availabilityId,
				patientId: body.patientId,
				doctorId: body.doctorId,
				scheduledAt: new Date(body.scheduledAt),
				status: "SCHEDULED" as ScheduleStatus,
			};

			jest.spyOn(createScheduleService, "run").mockResolvedValue(expectedResult);

			// Act
			const result = await controller.create(body);

			// Assert
			expect(result).toBe(expectedResult);
			expect(createScheduleService.run).toHaveBeenCalledWith({
				...body,
				scheduledAt: new Date(body.scheduledAt),
			});
			expect(createScheduleService.run).toHaveBeenCalledTimes(1);
		});

		it("deve propagar erro do service quando agendamento falhar", async () => {
			// Arrange
			const body: CreateScheduleBody = {
				availabilityId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
				patientId: "a47ac10b-58cc-4372-a567-0e02b2c3d480",
				doctorId: "b47ac10b-58cc-4372-a567-0e02b2c3d481",
				scheduledAt: "2025-08-20T10:00:00Z",
			};

			const expectedError = new Error("Horário não disponível");

			jest.spyOn(createScheduleService, "run").mockRejectedValue(expectedError);

			// Act & Assert
			await expect(controller.create(body))
				.rejects.toThrow(expectedError);

			expect(createScheduleService.run).toHaveBeenCalledWith({
				...body,
				scheduledAt: new Date(body.scheduledAt),
			});
			expect(createScheduleService.run).toHaveBeenCalledTimes(1);
		});

		it("deve converter string de data para objeto Date corretamente", async () => {
			// Arrange
			const body: CreateScheduleBody = {
				availabilityId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
				patientId: "a47ac10b-58cc-4372-a567-0e02b2c3d480",
				doctorId: "b47ac10b-58cc-4372-a567-0e02b2c3d481",
				scheduledAt: "2025-08-20T14:30:00Z",
			};

			const expectedResult = {
				id: "schedule-uuid",
				availabilityId: body.availabilityId,
				patientId: body.patientId,
				doctorId: body.doctorId,
				scheduledAt: new Date(body.scheduledAt),
				status: "SCHEDULED" as ScheduleStatus,
			};
			jest.spyOn(createScheduleService, "run").mockResolvedValue(expectedResult);

			// Act
			await controller.create(body);

			// Assert
			const expectedServiceCall = {
				...body,
				scheduledAt: new Date("2025-08-20T14:30:00Z"),
			};

			expect(createScheduleService.run).toHaveBeenCalledWith(expectedServiceCall);
			expect(createScheduleService.run).toHaveBeenCalledTimes(1);
		});
	});
});
