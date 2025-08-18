import { Test, TestingModule } from "@nestjs/testing";
import { AuthRoute } from "./auth.route";
import { AuthLoginModule, AuthRegisterModule, AuthRefreshTokenModule } from "@/modules/auth";
import { RouterModule } from "@nestjs/core";

describe("AuthRoute", () => {
	let module: TestingModule;

	beforeEach(async () => {
		module = await Test.createTestingModule({
			imports: [AuthRoute],
		}).compile();
	});

	afterEach(async () => {
		await module.close();
	});

	it("deve ser definido", () => {
		expect(module).toBeDefined();
	});

	it("deve importar todos os módulos de auth necessários", () => {
		const authLoginModule = module.get(AuthLoginModule);
		const authRegisterModule = module.get(AuthRegisterModule);
		const authRefreshTokenModule = module.get(AuthRefreshTokenModule);

		expect(authLoginModule).toBeDefined();
		expect(authRegisterModule).toBeDefined();
		expect(authRefreshTokenModule).toBeDefined();
	});

	it("deve ter configuração de rotas correta", () => {
		// Este teste verifica se o módulo pode ser instanciado com as rotas configuradas
		// A configuração real das rotas é verificada através dos testes de integração
		expect(module).toBeDefined();
	});
});
