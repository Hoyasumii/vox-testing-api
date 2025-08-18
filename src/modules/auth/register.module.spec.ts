import { Test, TestingModule } from "@nestjs/testing";
import { AuthRegisterModule } from "./register.module";
import { RegisterController } from "@/controllers/auth";
import { CreateUserService } from "@/services/users";

describe("AuthRegisterModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [AuthRegisterModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o RegisterController registrado", () => {
		const controller = module.get<RegisterController>(RegisterController);
		expect(controller).toBeInstanceOf(RegisterController);
	});

	it("deve ter o CreateUserService registrado", () => {
		const service = module.get<CreateUserService>(CreateUserService);
		expect(service).toBeInstanceOf(CreateUserService);
	});

	it("deve injetar CreateUserService no RegisterController", () => {
		const controller = module.get<RegisterController>(RegisterController);
		expect(controller["service"]).toBeInstanceOf(CreateUserService);
	});
});
