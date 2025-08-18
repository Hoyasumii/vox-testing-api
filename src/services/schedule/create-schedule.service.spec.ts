import { CreateScheduleService } from "./create-schedule.service";
import { ScheduleRepository } from "t/repositories/schedule.repository";
import { CreateScheduleDTO } from "@/dtos/schedules";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import { randomUUID } from "node:crypto";

describe("CreateScheduleService", () => {
	let service: CreateScheduleService;
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
		service = new CreateScheduleService(repository);
	});

	afterEach(() => {
		repository.clear();
		repository.clearAvailabilities();
	});

	describe("run", () => {
		it("deve criar um agendamento com sucesso", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			// Mock da disponibilidade do médico
			repository.addAvailability({
				availabilityId,
				doctorId,
				dayOfWeek: scheduledAt.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: scheduledAt,
				isAvailable: true,
			});

			// Mock do canal para verificar se a disponibilidade existe
			testChannel.register<string, boolean>(
				"doctor-availability:exists",
				async () => true,
			);

			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			// Act
			const result = await service.run(scheduleData);

			// Assert
			expect(result).toMatchObject({
				id: expect.any(String),
				status: "SCHEDULED",
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			});
			expect(repository.count()).toBe(1);
		});

		it("deve retornar bad request para dados inválidos", async () => {
			// Arrange
			const invalidData = {
				availabilityId: "invalid-uuid",
				patientId: randomUUID(),
				doctorId: randomUUID(),
				scheduledAt: "invalid-date",
			} as unknown as CreateScheduleDTO;

			// Act & Assert
			await expect(service.run(invalidData)).rejects.toThrow();
			expect(repository.count()).toBe(0);
		});

		it("deve retornar not found quando a disponibilidade não existe", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			// Mock do canal para retornar que a disponibilidade não existe
			testChannel.register<string, boolean>(
				"doctor-availability:exists",
				async () => false,
			);

			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			// Act & Assert
			await expect(service.run(scheduleData)).rejects.toThrow();
			expect(repository.count()).toBe(0);
		});

		it("deve retornar conflict quando o médico não está disponível", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			// Mock do canal para verificar se a disponibilidade existe
			testChannel.register<string, boolean>(
				"doctor-availability:exists",
				async () => true,
			);

			// Não adicionar disponibilidade para simular médico indisponível
			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			// Act & Assert
			await expect(service.run(scheduleData)).rejects.toThrow();
			expect(repository.count()).toBe(0);
		});

		it("deve retornar conflict quando o paciente já tem agendamento no mesmo horário", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			// Mock da disponibilidade do médico
			repository.addAvailability({
				availabilityId,
				doctorId,
				dayOfWeek: scheduledAt.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: scheduledAt,
				isAvailable: true,
			});

			// Mock do canal para verificar se a disponibilidade existe
			testChannel.register<string, boolean>(
				"doctor-availability:exists",
				async () => true,
			);

			// Criar agendamento existente para o mesmo paciente no mesmo horário
			const existingScheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt,
			};

			await repository.create(existingScheduleData);

			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			// Act & Assert
			await expect(service.run(scheduleData)).rejects.toThrow();
			expect(repository.count()).toBe(1); // Apenas o agendamento existente
		});

		it("deve permitir agendamento quando o paciente tem agendamento cancelado no mesmo horário", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			// Mock da disponibilidade do médico
			repository.addAvailability({
				availabilityId,
				doctorId,
				dayOfWeek: scheduledAt.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: scheduledAt,
				isAvailable: true,
			});

			// Mock do canal para verificar se a disponibilidade existe
			testChannel.register<string, boolean>(
				"doctor-availability:exists",
				async () => true,
			);

			// Criar agendamento cancelado para o mesmo paciente no mesmo horário
			const canceledScheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt,
			};

			const canceledSchedule = await repository.create(canceledScheduleData);
			await repository.cancel(canceledSchedule.id);

			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			// Act
			const result = await service.run(scheduleData);

			// Assert
			expect(result).toMatchObject({
				id: expect.any(String),
				status: "SCHEDULED",
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			});
			expect(repository.count()).toBe(2); // Agendamento cancelado + novo agendamento
		});

		it("deve permitir múltiplos agendamentos em horários diferentes para o mesmo paciente", async () => {
			// Arrange
			const availabilityId1 = randomUUID();
			const availabilityId2 = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt1 = new Date("2025-08-20T10:00:00Z");
			const scheduledAt2 = new Date("2025-08-20T11:00:00Z");

			// Mock das disponibilidades do médico
			repository.addAvailability({
				availabilityId: availabilityId1,
				doctorId,
				dayOfWeek: scheduledAt1.getDay(),
				startHour: 10,
				endHour: 11,
				availableDate: scheduledAt1,
				isAvailable: true,
			});

			repository.addAvailability({
				availabilityId: availabilityId2,
				doctorId,
				dayOfWeek: scheduledAt2.getDay(),
				startHour: 11,
				endHour: 12,
				availableDate: scheduledAt2,
				isAvailable: true,
			});

			// Mock do canal para verificar se a disponibilidade existe
			testChannel.register<string, boolean>(
				"doctor-availability:exists",
				async () => true,
			);

			const scheduleData1: CreateScheduleDTO = {
				availabilityId: availabilityId1,
				patientId,
				doctorId,
				scheduledAt: scheduledAt1,
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: availabilityId2,
				patientId,
				doctorId,
				scheduledAt: scheduledAt2,
			};

			// Act
			const result1 = await service.run(scheduleData1);
			const result2 = await service.run(scheduleData2);

			// Assert
			expect(result1).toMatchObject({
				id: expect.any(String),
				status: "SCHEDULED",
				availabilityId: availabilityId1,
				patientId,
				doctorId,
				scheduledAt: scheduledAt1,
			});

			expect(result2).toMatchObject({
				id: expect.any(String),
				status: "SCHEDULED",
				availabilityId: availabilityId2,
				patientId,
				doctorId,
				scheduledAt: scheduledAt2,
			});

			expect(repository.count()).toBe(2);
		});

		it("deve validar se o médico está disponível no horário específico", async () => {
			// Arrange
			const availabilityId = randomUUID();
			const doctorId = randomUUID();
			const patientId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			// Mock do canal para verificar se a disponibilidade existe
			testChannel.register<string, boolean>(
				"doctor-availability:exists",
				async () => true,
			);

			// Não adicionar nenhuma disponibilidade para simular médico indisponível
			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			// Act & Assert
			await expect(service.run(scheduleData)).rejects.toThrow();
			expect(repository.count()).toBe(0);
		});
	});
});
