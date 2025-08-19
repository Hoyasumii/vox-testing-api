import { Test, TestingModule } from "@nestjs/testing";
import { GetUserDataModule } from "./get-user-data.module";
import { GetUserDataController } from "@/controllers/users";
import { GetUserContentByIdService } from "@/services/users";

describe("GetUserDataModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GetUserDataModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	describe("Controller", () => {
		it("should provide GetUserDataController", () => {
			const controller = module.get<GetUserDataController>(GetUserDataController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(GetUserDataController);
		});
	});

	describe("Service", () => {
		it("should provide GetUserContentByIdService", () => {
			const service = module.get<GetUserContentByIdService>(GetUserContentByIdService);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(GetUserContentByIdService);
		});
	});

	describe("Module compilation", () => {
		it("should compile without errors", async () => {
			expect(module).toBeDefined();
		});

		it("should have all required dependencies", () => {
			const controller = module.get(GetUserDataController);
			const service = module.get(GetUserContentByIdService);

			expect(controller).toBeDefined();
			expect(service).toBeDefined();
		});
	});
});
