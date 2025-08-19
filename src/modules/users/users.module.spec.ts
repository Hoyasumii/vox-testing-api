import { Test, TestingModule } from "@nestjs/testing";
import { UsersModule } from "./users.module";
import { DeleteUserModule } from "./delete-user.module";
import { GetUserDataModule } from "./get-user-data.module";
import { UpdateUserModule } from "./update-user.module";
import {
	DeleteUserController,
	GetUserDataController,
	UpdateUserController,
} from "@/controllers/users";
import {
	DeleteUserService,
	GetUserContentByIdService,
	UpdateUserService,
} from "@/services/users";

describe("UsersModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [UsersModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	describe("Sub-modules", () => {
		it("should import DeleteUserModule", () => {
			const deleteUserModule = module.get(DeleteUserModule);
			expect(deleteUserModule).toBeDefined();
		});

		it("should import GetUserDataModule", () => {
			const getUserDataModule = module.get(GetUserDataModule);
			expect(getUserDataModule).toBeDefined();
		});

		it("should import UpdateUserModule", () => {
			const updateUserModule = module.get(UpdateUserModule);
			expect(updateUserModule).toBeDefined();
		});
	});

	describe("Controllers", () => {
		it("should provide DeleteUserController", () => {
			const controller = module.get<DeleteUserController>(DeleteUserController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(DeleteUserController);
		});

		it("should provide GetUserDataController", () => {
			const controller = module.get<GetUserDataController>(GetUserDataController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(GetUserDataController);
		});

		it("should provide UpdateUserController", () => {
			const controller = module.get<UpdateUserController>(UpdateUserController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(UpdateUserController);
		});
	});

	describe("Services", () => {
		it("should provide DeleteUserService", () => {
			const service = module.get<DeleteUserService>(DeleteUserService);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(DeleteUserService);
		});

		it("should provide GetUserContentByIdService", () => {
			const service = module.get<GetUserContentByIdService>(GetUserContentByIdService);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(GetUserContentByIdService);
		});

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
			const controllers = [DeleteUserController, GetUserDataController, UpdateUserController];
			const services = [DeleteUserService, GetUserContentByIdService, UpdateUserService];

			controllers.forEach(Controller => {
				const controller = module.get(Controller);
				expect(controller).toBeDefined();
			});

			services.forEach(Service => {
				const service = module.get(Service);
				expect(service).toBeDefined();
			});
		});
	});
});
