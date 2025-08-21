import { Test, TestingModule } from "@nestjs/testing";
import { GetScheduleByIdModule } from "./get-schedule-by-id.module";
import { GetScheduleByIdController } from "@/controllers/schedules";
import { GetScheduleByIdService } from "@/services/schedule";

describe("GetScheduleByIdModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GetScheduleByIdModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o GetScheduleByIdController registrado", () => {
		const controller = module.get<GetScheduleByIdController>(GetScheduleByIdController);
		expect(controller).toBeInstanceOf(GetScheduleByIdController);
	});

	it("deve ter o GetScheduleByIdService registrado", () => {
		const service = module.get<GetScheduleByIdService>(GetScheduleByIdService);
		expect(service).toBeInstanceOf(GetScheduleByIdService);
	});

	it("deve injetar GetScheduleByIdService no GetScheduleByIdController", () => {
		const controller = module.get<GetScheduleByIdController>(GetScheduleByIdController);
		expect(controller["service"]).toBeInstanceOf(GetScheduleByIdService);
	});
});
