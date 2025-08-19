import { Test, TestingModule } from "@nestjs/testing";
import { DeleteUserModule } from "./delete-user.module";
import { DeleteUserController } from "@/controllers/users";
import { DeleteUserService } from "@/services/users";

describe("DeleteUserModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [DeleteUserModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	describe("Controller", () => {
		it("should provide DeleteUserController", () => {
			const controller = module.get<DeleteUserController>(DeleteUserController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(DeleteUserController);
		});
	});

	describe("Service", () => {
		it("should provide DeleteUserService", () => {
			const service = module.get<DeleteUserService>(DeleteUserService);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(DeleteUserService);
		});
	});

	describe("Module compilation", () => {
		it("should compile without errors", async () => {
			expect(module).toBeDefined();
		});

		it("should have all required dependencies", () => {
			const controller = module.get(DeleteUserController);
			const service = module.get(DeleteUserService);

			expect(controller).toBeDefined();
			expect(service).toBeDefined();
		});
	});
});
