import { Test, TestingModule } from "@nestjs/testing";
import { UpdateUserModule } from "./update-user.module";
import { UpdateUserController } from "@/controllers/users";
import { UpdateUserService } from "@/services/users";

describe("UpdateUserModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [UpdateUserModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	describe("Controller", () => {
		it("should provide UpdateUserController", () => {
			const controller = module.get<UpdateUserController>(UpdateUserController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(UpdateUserController);
		});
	});

	describe("Service", () => {
		it("should provide UpdateUserService", () => {
			const service = module.get<UpdateUserService>(UpdateUserService);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(UpdateUserService);
		});
	});

	describe("Module compilation", () => {
		it("should compile without errors", async () => {
			expect(module).toBeDefined();
		});

		it("should have all required dependencies", () => {
			const controller = module.get(UpdateUserController);
			const service = module.get(UpdateUserService);

			expect(controller).toBeDefined();
			expect(service).toBeDefined();
		});
	});
});
