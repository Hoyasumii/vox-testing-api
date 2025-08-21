import { Test, TestingModule } from "@nestjs/testing";
import { CreateScheduleModule } from "./create-schedule.module";
import { CreateScheduleController } from "@/controllers/schedules";
import { CreateScheduleService } from "@/services/schedule";

describe("CreateScheduleModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [CreateScheduleModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o CreateScheduleController registrado", () => {
		const controller = module.get<CreateScheduleController>(CreateScheduleController);
		expect(controller).toBeInstanceOf(CreateScheduleController);
	});

	it("deve ter o CreateScheduleService registrado", () => {
		const service = module.get<CreateScheduleService>(CreateScheduleService);
		expect(service).toBeInstanceOf(CreateScheduleService);
	});

	it("deve injetar CreateScheduleService no CreateScheduleController", () => {
		const controller = module.get<CreateScheduleController>(CreateScheduleController);
		expect(controller["service"]).toBeInstanceOf(CreateScheduleService);
	});
});
