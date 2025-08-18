import { Test, TestingModule } from "@nestjs/testing";
import { AuthLoginModule } from "./login.module";
import { LoginController } from "@/controllers/auth";
import { AuthenticateUserService } from "@/services/users";

describe("AuthLoginModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [AuthLoginModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o LoginController registrado", () => {
		const controller = module.get<LoginController>(LoginController);
		expect(controller).toBeInstanceOf(LoginController);
	});

	it("deve ter o AuthenticateUserService registrado", () => {
		const service = module.get<AuthenticateUserService>(AuthenticateUserService);
		expect(service).toBeInstanceOf(AuthenticateUserService);
	});

	it("deve injetar AuthenticateUserService no LoginController", () => {
		const controller = module.get<LoginController>(LoginController);
		expect(controller["service"]).toBeInstanceOf(AuthenticateUserService);
	});
});
