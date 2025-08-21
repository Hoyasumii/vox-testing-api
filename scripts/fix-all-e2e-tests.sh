#!/bin/bash

set -e

echo "🔧 Corrigindo todos os testes E2E para 100% de cobertura..."

# Função para recriar arquivo users.e2e-spec.ts
create_users_test() {
cat > test/routes/users.e2e-spec.ts << 'EOF'
import { Test, type TestingModule } from "@nestjs/testing";
import type { INestApplication } from "@nestjs/common";
import request from "supertest";
import { UsersRoute } from "@/routes/users.route";
import { createTestUser, setupTestApp } from "../setup-e2e";
import { SignJwtToken } from "@/services/jwt";

describe("UsersRoute (e2e)", () => {
	let app: INestApplication;
	let authToken: string;
	let userId: string;

	beforeEach(async () => {
		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [UsersRoute],
		}).compile();

		app = moduleFixture.createNestApplication();
		await setupTestApp(app);

		// Criar usuário de teste
		const user = await createTestUser("PATIENT");
		userId = user.id;

		const signJwtToken = new SignJwtToken();
		authToken = await signJwtToken.run({ userId: user.id });
	});

	afterEach(async () => {
		await app.close();
	});

	describe("GET /me", () => {
		it("deve retornar dados do usuário autenticado", () => {
			return request(app.getHttpServer())
				.get("/me")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("id", userId);
					expect(res.body.data).toHaveProperty("name");
					expect(res.body.data).toHaveProperty("email");
					expect(res.body.data).toHaveProperty("type");
					expect(res.body.data).not.toHaveProperty("password");
				});
		});

		it("deve rejeitar request sem token", () => {
			return request(app.getHttpServer())
				.get("/me")
				.expect(401);
		});

		it("deve rejeitar token inválido", () => {
			return request(app.getHttpServer())
				.get("/me")
				.set("Authorization", "Bearer invalid-token")
				.expect(401);
		});
	});

	describe("PUT /me", () => {
		it("deve atualizar dados do usuário", () => {
			const updateData = { name: "Nome Atualizado" };

			return request(app.getHttpServer())
				.put("/me")
				.set("Authorization", `Bearer ${authToken}`)
				.send(updateData)
				.expect(200)
				.expect((res) => {
					expect(res.body.data).toHaveProperty("name", "Nome Atualizado");
				});
		});

		it("deve rejeitar dados inválidos", () => {
			const invalidData = { name: "" }; // Nome vazio

			return request(app.getHttpServer())
				.put("/me")
				.set("Authorization", `Bearer ${authToken}`)
				.send(invalidData)
				.expect(400);
		});

		it("deve rejeitar request sem token", () => {
			return request(app.getHttpServer())
				.put("/me")
				.send({ name: "Novo Nome" })
				.expect(401);
		});
	});

	describe("DELETE /me", () => {
		it("deve deletar conta do usuário", () => {
			return request(app.getHttpServer())
				.delete("/me")
				.set("Authorization", `Bearer ${authToken}`)
				.expect(200);
		});

		it("deve rejeitar request sem token", () => {
			return request(app.getHttpServer())
				.delete("/me")
				.expect(401);
		});
	});
});
EOF
}

# Função para corrigir availability.e2e-spec.ts
fix_availability_test() {
	# Corrigir os formatos de resposta
	sed -i '' 's/expect(Array\.isArray(res\.body))/expect(Array.isArray(res.body.data))/g' test/routes/availability.e2e-spec.ts
	sed -i '' 's/expect(res\.body\.length)/expect(res.body.data.length)/g' test/routes/availability.e2e-spec.ts
	echo "✅ Corrigido availability.e2e-spec.ts"
}

# Função para corrigir doctor-availability.e2e-spec.ts
fix_doctor_availability_test() {
	sed -i '' 's/expect(Array\.isArray(res\.body))/expect(Array.isArray(res.body.data))/g' test/routes/doctor-availability.e2e-spec.ts
	sed -i '' 's/expect(res\.body\.length)/expect(res.body.data.length)/g' test/routes/doctor-availability.e2e-spec.ts
	sed -i '' 's/expect(res\.body)\.toHaveProperty/expect(res.body.data).toHaveProperty/g' test/routes/doctor-availability.e2e-spec.ts
	sed -i '' 's/expect(res\.body\.deletedCount)/expect(res.body.data.deletedCount)/g' test/routes/doctor-availability.e2e-spec.ts
	echo "✅ Corrigido doctor-availability.e2e-spec.ts"
}

# Função para corrigir reports.e2e-spec.ts
fix_reports_test() {
	sed -i '' 's/expect(Array\.isArray(res\.body))/expect(Array.isArray(res.body.data))/g' test/routes/reports.e2e-spec.ts
	sed -i '' 's/expect(res\.body\.length)/expect(res.body.data.length)/g' test/routes/reports.e2e-spec.ts
	echo "✅ Corrigido reports.e2e-spec.ts"
}

# Executar correções
echo "📝 Recriando users.e2e-spec.ts..."
create_users_test

echo "🔧 Aplicando correções de formato de resposta..."
fix_availability_test
fix_doctor_availability_test
fix_reports_test

echo "✅ Todos os testes E2E foram corrigidos!"
echo ""
echo "📋 Para executar os testes:"
echo "   ./scripts/test-e2e.sh           # Todos os testes"
echo "   ./scripts/test-e2e-core.sh      # Apenas testes principais"
