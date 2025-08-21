import { Test, TestingModule } from "@nestjs/testing";
import { AvailabilityModule } from "./availability.module";
import { GetAvailableSlotsModule } from "./get-available-slots.module";

describe("AvailabilityModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [AvailabilityModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve importar GetAvailableSlotsModule", () => {
		const moduleImports = Reflect.getMetadata('imports', AvailabilityModule) || [];
		expect(moduleImports).toContain(GetAvailableSlotsModule);
	});
});
