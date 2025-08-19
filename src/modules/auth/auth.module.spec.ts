import { Test, TestingModule } from "@nestjs/testing";
import { AuthModule } from "./auth.module";
import { AuthLoginModule } from "./login.module";
import { AuthRegisterModule } from "./register.module";
import { AuthRefreshTokenModule } from "./refresh-token.module";
import { LoginController, RegisterController, RefreshTokenController } from "@/controllers/auth";
import { AuthenticateUserService, CreateUserService } from "@/services/users";
import { RefreshJwtToken, VerifyJwtToken } from "@/services/jwt";

describe("AuthModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [AuthModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	describe("Sub-modules", () => {
		it("should import AuthLoginModule", () => {
			const loginModule = module.get(AuthLoginModule);
			expect(loginModule).toBeDefined();
		});

		it("should import AuthRegisterModule", () => {
			const registerModule = module.get(AuthRegisterModule);
			expect(registerModule).toBeDefined();
		});

		it("should import AuthRefreshTokenModule", () => {
			const refreshTokenModule = module.get(AuthRefreshTokenModule);
			expect(refreshTokenModule).toBeDefined();
		});
	});

	describe("Controllers", () => {
		it("should provide LoginController", () => {
			const controller = module.get<LoginController>(LoginController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(LoginController);
		});

		it("should provide RegisterController", () => {
			const controller = module.get<RegisterController>(RegisterController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(RegisterController);
		});

		it("should provide RefreshTokenController", () => {
			const controller = module.get<RefreshTokenController>(RefreshTokenController);
			expect(controller).toBeDefined();
			expect(controller).toBeInstanceOf(RefreshTokenController);
		});
	});

	describe("Services", () => {
		it("should provide AuthenticateUserService", () => {
			const service = module.get<AuthenticateUserService>(AuthenticateUserService);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(AuthenticateUserService);
		});

		it("should provide CreateUserService", () => {
			const service = module.get<CreateUserService>(CreateUserService);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(CreateUserService);
		});

		it("should provide VerifyJwtToken", () => {
			const service = module.get<VerifyJwtToken>(VerifyJwtToken);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(VerifyJwtToken);
		});

		it("should provide RefreshJwtToken", () => {
			const service = module.get<RefreshJwtToken>(RefreshJwtToken);
			expect(service).toBeDefined();
			expect(service).toBeInstanceOf(RefreshJwtToken);
		});
	});

	describe("Module compilation", () => {
		it("should compile without errors", async () => {
			expect(module).toBeDefined();
		});

		it("should have all required dependencies", () => {
			const controllers = [LoginController, RegisterController, RefreshTokenController];
			const services = [AuthenticateUserService, CreateUserService, VerifyJwtToken, RefreshJwtToken];

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
