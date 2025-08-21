import { Test, TestingModule } from "@nestjs/testing";
import { CompleteScheduleModule } from "./complete-schedule.module";
import { CompleteScheduleController } from "@/controllers/schedules";
import { CompleteScheduleService } from "@/services/schedule";

describe("CompleteScheduleModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [CompleteScheduleModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o CompleteScheduleController registrado", () => {
		const controller = module.get<CompleteScheduleController>(CompleteScheduleController);
		expect(controller).toBeInstanceOf(CompleteScheduleController);
	});

	it("deve ter o CompleteScheduleService registrado", () => {
		const service = module.get<CompleteScheduleService>(CompleteScheduleService);
		expect(service).toBeInstanceOf(CompleteScheduleService);
	});

	it("deve injetar CompleteScheduleService no CompleteScheduleController", () => {
		const controller = module.get<CompleteScheduleController>(CompleteScheduleController);
		expect(controller["service"]).toBeInstanceOf(CompleteScheduleService);
	});
});
