import { Test, TestingModule } from "@nestjs/testing";
import { DeleteScheduleModule } from "./delete-schedule.module";
import { DeleteScheduleController } from "@/controllers/schedules";
import { DeleteScheduleService } from "@/services/schedule";

describe("DeleteScheduleModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [DeleteScheduleModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o DeleteScheduleController registrado", () => {
		const controller = module.get<DeleteScheduleController>(DeleteScheduleController);
		expect(controller).toBeInstanceOf(DeleteScheduleController);
	});

	it("deve ter o DeleteScheduleService registrado", () => {
		const service = module.get<DeleteScheduleService>(DeleteScheduleService);
		expect(service).toBeInstanceOf(DeleteScheduleService);
	});

	it("deve injetar DeleteScheduleService no DeleteScheduleController", () => {
		const controller = module.get<DeleteScheduleController>(DeleteScheduleController);
		expect(controller["service"]).toBeInstanceOf(DeleteScheduleService);
	});
});
