import { Test, TestingModule } from "@nestjs/testing";
import { CancelScheduleModule } from "./cancel-schedule.module";
import { CancelScheduleController } from "@/controllers/schedules";
import { CancelScheduleService } from "@/services/schedule";

describe("CancelScheduleModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [CancelScheduleModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o CancelScheduleController registrado", () => {
		const controller = module.get<CancelScheduleController>(CancelScheduleController);
		expect(controller).toBeInstanceOf(CancelScheduleController);
	});

	it("deve ter o CancelScheduleService registrado", () => {
		const service = module.get<CancelScheduleService>(CancelScheduleService);
		expect(service).toBeInstanceOf(CancelScheduleService);
	});

	it("deve injetar CancelScheduleService no CancelScheduleController", () => {
		const controller = module.get<CancelScheduleController>(CancelScheduleController);
		expect(controller["service"]).toBeInstanceOf(CancelScheduleService);
	});
});
