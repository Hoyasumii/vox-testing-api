import { Test, TestingModule } from "@nestjs/testing";
import { GuardsModule } from "./guards.module";
import { JwtAuthGuard } from "../../guards/jwt-auth.guard";
import { RolesGuard } from "../../guards/roles.guard";
import { VerifyJwtToken } from "@/services/jwt";
import { GetUserContentByIdService } from "@/services/users";

describe("GuardsModule", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [GuardsModule],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve ter o JwtAuthGuard registrado", () => {
		const jwtAuthGuard = module.get<JwtAuthGuard>(JwtAuthGuard);
		expect(jwtAuthGuard).toBeInstanceOf(JwtAuthGuard);
	});

	it("deve ter o RolesGuard registrado", () => {
		const rolesGuard = module.get<RolesGuard>(RolesGuard);
		expect(rolesGuard).toBeInstanceOf(RolesGuard);
	});

	it("deve ter o VerifyJwtToken registrado", () => {
		const verifyJwtToken = module.get<VerifyJwtToken>(VerifyJwtToken);
		expect(verifyJwtToken).toBeInstanceOf(VerifyJwtToken);
	});

	it("deve ter o GetUserContentByIdService registrado", () => {
		const getUserService = module.get<GetUserContentByIdService>(GetUserContentByIdService);
		expect(getUserService).toBeInstanceOf(GetUserContentByIdService);
	});
});
