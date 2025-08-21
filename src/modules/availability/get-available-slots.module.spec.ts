import { Test, TestingModule } from "@nestjs/testing";
import { GetAvailableSlotsModule } from "./get-available-slots.module";
import { GetAvailableSlotsController } from "@/controllers/availability";
import { GetAvailableSlotsSerice } from "@/services/schedule";

describe("GetAvailableSlotsModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GetAvailableSlotsModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o GetAvailableSlotsController registrado", () => {
		const controller = module.get<GetAvailableSlotsController>(GetAvailableSlotsController);
		expect(controller).toBeInstanceOf(GetAvailableSlotsController);
	});

	it("deve ter o GetAvailableSlotsSerice registrado", () => {
		const service = module.get<GetAvailableSlotsSerice>(GetAvailableSlotsSerice);
		expect(service).toBeInstanceOf(GetAvailableSlotsSerice);
	});

	it("deve injetar GetAvailableSlotsSerice no GetAvailableSlotsController", () => {
		const controller = module.get<GetAvailableSlotsController>(GetAvailableSlotsController);
		expect(controller["service"]).toBeInstanceOf(GetAvailableSlotsSerice);
	});
});
