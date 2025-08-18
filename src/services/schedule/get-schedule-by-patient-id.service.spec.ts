import { GetScheduleByPatientIdService } from "./get-schedule-by-patient-id.service";
import { ScheduleRepository } from "t/repositories/schedule.repository";
import { CreateScheduleDTO } from "@/dtos/schedules";
import { MemoryCache } from "t/cache/memory-cache";
import { testChannel } from "t/channels";
import { randomUUID } from "node:crypto";

describe("GetScheduleByPatientIdService", () => {
	let service: GetScheduleByPatientIdService;
	let repository: ScheduleRepository;

	beforeEach(() => {
		const cache = new MemoryCache();
		repository = new ScheduleRepository(cache, testChannel);
		service = new GetScheduleByPatientIdService(repository);
	});

	afterEach(() => {
		repository.clear();
		repository.clearAvailabilities();
	});

	describe("run", () => {
		it("deve retornar agendamentos de um paciente específico", async () => {
			// Arrange
			const patientId = randomUUID();
			const otherPatientId = randomUUID();
			const doctorId = randomUUID();

			const scheduleData1: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId,
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T11:00:00Z"),
			};

			const scheduleDataOtherPatient: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: otherPatientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			};

			await repository.create(scheduleData1);
			await repository.create(scheduleData2);
			await repository.create(scheduleDataOtherPatient);

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toHaveLength(2);
			expect(result.every(schedule => schedule.patientId === patientId)).toBe(true);
			expect(result).toEqual(
				expect.arrayContaining([
					expect.objectContaining({
						patientId,
						doctorId,
						scheduledAt: scheduleData1.scheduledAt,
					}),
					expect.objectContaining({
						patientId,
						scheduledAt: scheduleData2.scheduledAt,
					}),
				])
			);
		});

		it("deve retornar array vazio quando paciente não tem agendamentos", async () => {
			// Arrange
			const patientId = randomUUID();
			const otherPatientId = randomUUID();

			// Criar agendamento para outro paciente
			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId: otherPatientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			await repository.create(scheduleData);

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toEqual([]);
		});

		it("deve retornar bad request para patientId inválido", async () => {
			// Arrange
			const invalidPatientId = "invalid-uuid";

			// Act & Assert
			await expect(service.run(invalidPatientId as any)).rejects.toThrow();
		});

		it("deve retornar array vazio para paciente que existe mas não tem agendamentos", async () => {
			// Arrange
			const patientId = randomUUID();

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toEqual([]);
		});

		it("deve retornar agendamentos em todos os status", async () => {
			// Arrange
			const patientId = randomUUID();

			const scheduleData1: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T11:00:00Z"),
			};

			const scheduleData3: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			};

			const schedule1 = await repository.create(scheduleData1);
			const schedule2 = await repository.create(scheduleData2);
			const schedule3 = await repository.create(scheduleData3);

			// Alterar status dos agendamentos
			await repository.cancel(schedule2.id);
			await repository.complete(schedule3.id);

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toHaveLength(3);
			
			const scheduledCount = result.filter(s => s.status === "SCHEDULED").length;
			const canceledCount = result.filter(s => s.status === "CANCELED").length;
			const completedCount = result.filter(s => s.status === "COMPLETED").length;
			
			expect(scheduledCount).toBe(1);
			expect(canceledCount).toBe(1);
			expect(completedCount).toBe(1);
		});

		it("deve retornar agendamentos ordenados por data de agendamento", async () => {
			// Arrange
			const patientId = randomUUID();

			const scheduleData1: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T08:00:00Z"),
			};

			const scheduleData3: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			await repository.create(scheduleData1);
			await repository.create(scheduleData2);
			await repository.create(scheduleData3);

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toHaveLength(3);
			expect(result[0].scheduledAt).toEqual(scheduleData2.scheduledAt);
			expect(result[1].scheduledAt).toEqual(scheduleData3.scheduledAt);
			expect(result[2].scheduledAt).toEqual(scheduleData1.scheduledAt);
		});

		it("deve retornar agendamentos com informações completas", async () => {
			// Arrange
			const patientId = randomUUID();
			const doctorId = randomUUID();
			const availabilityId = randomUUID();
			const scheduledAt = new Date("2025-08-20T10:00:00Z");

			const scheduleData: CreateScheduleDTO = {
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			};

			const createdSchedule = await repository.create(scheduleData);

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				id: createdSchedule.id,
				status: "SCHEDULED",
				availabilityId,
				patientId,
				doctorId,
				scheduledAt,
			});
		});

		it("deve retornar apenas agendamentos do paciente especificado mesmo com múltiplos pacientes", async () => {
			// Arrange
			const patientId = randomUUID();
			const patient2Id = randomUUID();
			const patient3Id = randomUUID();

			// Criar agendamentos para diferentes pacientes
			await repository.create({
				availabilityId: randomUUID(),
				patientId: patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			});

			await repository.create({
				availabilityId: randomUUID(),
				patientId: patient2Id,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T11:00:00Z"),
			});

			await repository.create({
				availabilityId: randomUUID(),
				patientId: patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			});

			await repository.create({
				availabilityId: randomUUID(),
				patientId: patient3Id,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T13:00:00Z"),
			});

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toHaveLength(2);
			expect(result.every(schedule => schedule.patientId === patientId)).toBe(true);
		});

		it("deve retornar agendamentos com diferentes médicos para o mesmo paciente", async () => {
			// Arrange
			const patientId = randomUUID();
			const doctor1Id = randomUUID();
			const doctor2Id = randomUUID();
			const doctor3Id = randomUUID();

			const scheduleData1: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: doctor1Id,
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const scheduleData2: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: doctor2Id,
				scheduledAt: new Date("2025-08-20T11:00:00Z"),
			};

			const scheduleData3: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: doctor3Id,
				scheduledAt: new Date("2025-08-20T12:00:00Z"),
			};

			await repository.create(scheduleData1);
			await repository.create(scheduleData2);
			await repository.create(scheduleData3);

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toHaveLength(3);
			
			const doctorIds = result.map(s => s.doctorId);
			expect(doctorIds).toContain(doctor1Id);
			expect(doctorIds).toContain(doctor2Id);
			expect(doctorIds).toContain(doctor3Id);
		});

		it("deve ser consistente com múltiplas chamadas para o mesmo paciente", async () => {
			// Arrange
			const patientId = randomUUID();

			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			await repository.create(scheduleData);

			// Act
			const result1 = await service.run(patientId);
			const result2 = await service.run(patientId);
			const result3 = await service.run(patientId);

			// Assert
			expect(result1).toEqual(result2);
			expect(result2).toEqual(result3);
			expect(result1).toHaveLength(1);
		});

		it("deve validar formato UUID corretamente", async () => {
			// Arrange & Act & Assert
			const testCases = [
				"",
				"123",
				"abc-def-ghi",
				"not-a-uuid",
				"12345678-1234-1234-1234-123456789012z", // UUID inválido
				undefined,
				null,
			];

			for (const testCase of testCases) {
				await expect(service.run(testCase as any)).rejects.toThrow();
			}
		});

		it("deve incluir agendamentos cancelados no histórico do paciente", async () => {
			// Arrange
			const patientId = randomUUID();

			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);
			await repository.cancel(schedule.id);

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				id: schedule.id,
				status: "CANCELED",
				patientId,
			});
		});

		it("deve incluir agendamentos completados no histórico do paciente", async () => {
			// Arrange
			const patientId = randomUUID();

			const scheduleData: CreateScheduleDTO = {
				availabilityId: randomUUID(),
				patientId,
				doctorId: randomUUID(),
				scheduledAt: new Date("2025-08-20T10:00:00Z"),
			};

			const schedule = await repository.create(scheduleData);
			await repository.complete(schedule.id);

			// Act
			const result = await service.run(patientId);

			// Assert
			expect(result).toHaveLength(1);
			expect(result[0]).toMatchObject({
				id: schedule.id,
				status: "COMPLETED",
				patientId,
			});
		});
	});
});
