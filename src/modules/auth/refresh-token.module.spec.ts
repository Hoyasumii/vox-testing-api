import { Test, TestingModule } from "@nestjs/testing";
import { AuthRefreshTokenModule } from "./refresh-token.module";
import { RefreshTokenController } from "@/controllers/auth";
import { RefreshJwtToken, VerifyJwtToken } from "@/services/jwt";

describe("AuthRefreshTokenModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [AuthRefreshTokenModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o RefreshTokenController registrado", () => {
		const controller = module.get<RefreshTokenController>(RefreshTokenController);
		expect(controller).toBeInstanceOf(RefreshTokenController);
	});

	it("deve ter o VerifyJwtToken registrado", () => {
		const service = module.get<VerifyJwtToken>(VerifyJwtToken);
		expect(service).toBeInstanceOf(VerifyJwtToken);
	});

	it("deve ter o RefreshJwtToken registrado", () => {
		const service = module.get<RefreshJwtToken>(RefreshJwtToken);
		expect(service).toBeInstanceOf(RefreshJwtToken);
	});

	it("deve injetar os serviços no RefreshTokenController", () => {
		const controller = module.get<RefreshTokenController>(RefreshTokenController);
		expect(controller["verifyJwtToken"]).toBeInstanceOf(VerifyJwtToken);
		expect(controller["refreshJwtToken"]).toBeInstanceOf(RefreshJwtToken);
	});
});
