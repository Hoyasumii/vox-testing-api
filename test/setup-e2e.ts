import { PrismaClient } from "../generated/prisma";
import type { INestApplication } from "@nestjs/common";
import { HttpAdapterHost } from "@nestjs/core";
import { CatchEverything, StandardizeResponse } from "@/interceptors";

const prisma = new PrismaClient();

export const setupTestApp = async (app: INestApplication) => {
	const httpAdapterHost = app.get(HttpAdapterHost);
	
	// Aplicar o mesmo filtro de exceção global usado na aplicação principal
	app.useGlobalFilters(new CatchEverything(httpAdapterHost));
	
	// Aplicar o interceptor de resposta padrão
	app.useGlobalInterceptors(new StandardizeResponse());
	
	await app.init();
	return app;
};

beforeAll(async () => {
	// Conectar ao banco de dados de teste
	await prisma.$connect();
});

beforeEach(async () => {
	// Limpar o banco de dados antes de cada teste
	await prisma.schedule.deleteMany();
	await prisma.doctorAvailability.deleteMany();
	await prisma.doctor.deleteMany();
	await prisma.user.deleteMany();
});

afterAll(async () => {
	// Limpar tudo e desconectar após todos os testes
	await prisma.schedule.deleteMany();
	await prisma.doctorAvailability.deleteMany();
	await prisma.doctor.deleteMany();
	await prisma.user.deleteMany();
	await prisma.$disconnect();
});

// Funções utilitárias para os testes
export const createTestUser = async (type: "DOCTOR" | "PATIENT", email?: string) => {
	const userEmail = email || `test-${type.toLowerCase()}-${Date.now()}@email.com`;
	
	const user = await prisma.user.create({
		data: {
			name: `Test User ${Date.now()}`,
			email: userEmail,
			// Senha que atende aos critérios: Password123! (hash com secret)
			password: "$argon2id$v=19$m=65536,t=3,p=4$EwVpCSfoNisL3VUFGnMj8w$8AbbNOK+y+BUBLJUC/bigusmyHZwuBwTkkliRY8vteU",
			type,
		},
	});

	if (type === "DOCTOR") {
		await prisma.doctor.create({
			data: {
				id: user.id,
			},
		});
	}

	return user;
};

export const createTestAvailability = async (doctorId: string) => {
	// Usar valores únicos para evitar constraint violations
	const randomHour = Math.floor(Math.random() * 8) + 8; // 8-15
	const dayOfWeek = Math.floor(Math.random() * 7) + 1; // 1-7
	
	return await prisma.doctorAvailability.create({
		data: {
			doctorId,
			dayOfWeek,
			startHour: randomHour,
			endHour: randomHour + 2, // 2 horas de duração
		},
	});
};

export const createTestSchedule = async (patientId: string, doctorId: string, availabilityId: string) => {
	// Criar uma data futura para o agendamento
	const futureDate = new Date();
	futureDate.setDate(futureDate.getDate() + 1);
	futureDate.setHours(10, 0, 0, 0);

	return await prisma.schedule.create({
		data: {
			patientId,
			doctorId,
			availabilityId,
			scheduledAt: futureDate,
			status: "SCHEDULED",
		},
	});
};

export { prisma };
