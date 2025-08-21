import { Test, TestingModule } from "@nestjs/testing";
import { ListSchedulesModule } from "./list-schedules.module";
import { ListSchedulesController } from "@/controllers/schedules";
import { ListSchedulesService } from "@/services/schedule";

describe("ListSchedulesModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [ListSchedulesModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o ListSchedulesController registrado", () => {
		const controller = module.get<ListSchedulesController>(ListSchedulesController);
		expect(controller).toBeInstanceOf(ListSchedulesController);
	});

	it("deve ter o ListSchedulesService registrado", () => {
		const service = module.get<ListSchedulesService>(ListSchedulesService);
		expect(service).toBeInstanceOf(ListSchedulesService);
	});

	it("deve injetar ListSchedulesService no ListSchedulesController", () => {
		const controller = module.get<ListSchedulesController>(ListSchedulesController);
		expect(controller["service"]).toBeInstanceOf(ListSchedulesService);
	});
});
