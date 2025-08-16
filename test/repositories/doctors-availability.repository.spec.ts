import { DoctorsAvailabilityRepository } from "./doctors-availability.repository";
import { 
	CreateDoctorAvailabilityDTO, 
	UpdateDoctorAvailabilityDTO,
} from "@/dtos/doctors-availability";
import { randomUUID } from "node:crypto";
import { MemoryCache } from "../cache";
import { testChannel } from "t/channels";

describe("InMemoryDoctorsAvailabilityRepository", () => {
	let repository: DoctorsAvailabilityRepository;

	beforeEach(() => {
		const cache = new MemoryCache()
		repository = new DoctorsAvailabilityRepository(cache, testChannel);
	});

	describe("create", () => {
		it("deve criar uma disponibilidade de médico com sucesso", async () => {
			const availabilityData: CreateDoctorAvailabilityDTO = {
				doctorId: randomUUID(),
				dayOfWeek: 1, // Segunda-feira
				startHour: 8,
				endHour: 12,
			};

			await repository.create(availabilityData);

			expect(repository.count()).toBe(1);
			const availabilities = repository.findAll();
			expect(availabilities[0]).toMatchObject({
				doctorId: availabilityData.doctorId,
				dayOfWeek: availabilityData.dayOfWeek,
				startHour: availabilityData.startHour,
				endHour: availabilityData.endHour,
			});
			expect(availabilities[0].id).toBeDefined();
		});

		it("deve criar múltiplas disponibilidades para o mesmo médico", async () => {
			const doctorId = randomUUID();
			
			const availability1: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 1, // Segunda-feira
				startHour: 8,
				endHour: 12,
			};

			const availability2: CreateDoctorAvailabilityDTO = {
				doctorId,
				dayOfWeek: 2, // Terça-feira
				startHour: 14,
				endHour: 18,
			};

			await repository.create(availability1);
			await repository.create(availability2);

			expect(repository.count()).toBe(2);
			const availabilities = await repository.findByDoctorId(doctorId);
			expect(availabilities).toHaveLength(2);
		});

		it("deve criar disponibilidades para médicos diferentes", async () => {
			const doctor1Id = randomUUID();
			const doctor2Id = randomUUID();
			
			const availability1: CreateDoctorAvailabilityDTO = {
				doctorId: doctor1Id,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			};

			const availability2: CreateDoctorAvailabilityDTO = {
				doctorId: doctor2Id,
				dayOfWeek: 1,
				startHour: 14,
				endHour: 18,
			};

			await repository.create(availability1);
			await repository.create(availability2);

			expect(repository.count()).toBe(2);
			
			const doctor1Availabilities = await repository.findByDoctorId(doctor1Id);
			const doctor2Availabilities = await repository.findByDoctorId(doctor2Id);
			
			expect(doctor1Availabilities).toHaveLength(1);
			expect(doctor2Availabilities).toHaveLength(1);
		});
	});

	describe("findByDoctorId", () => {
		it("deve retornar array vazio quando médico não tem disponibilidades", async () => {
			const doctorId = randomUUID();
			
			const result = await repository.findByDoctorId(doctorId);
			
			expect(result).toEqual([]);
		});

		it("deve retornar todas as disponibilidades de um médico específico", async () => {
			const doctor1Id = randomUUID();
			const doctor2Id = randomUUID();
			
			// Criar disponibilidades para o primeiro médico
			await repository.create({
				doctorId: doctor1Id,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			await repository.create({
				doctorId: doctor1Id,
				dayOfWeek: 2,
				startHour: 14,
				endHour: 18,
			});

			// Criar disponibilidade para o segundo médico
			await repository.create({
				doctorId: doctor2Id,
				dayOfWeek: 3,
				startHour: 9,
				endHour: 17,
			});

			const doctor1Availabilities = await repository.findByDoctorId(doctor1Id);
			
			expect(doctor1Availabilities).toHaveLength(2);
			expect(doctor1Availabilities.every(av => av.doctorId === doctor1Id)).toBe(true);
		});

		it("deve retornar disponibilidades com todos os campos necessários", async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			const result = await repository.findByDoctorId(doctorId);
			
			expect(result).toHaveLength(1);
			expect(result[0]).toHaveProperty("id");
			expect(result[0]).toHaveProperty("doctorId", doctorId);
			expect(result[0]).toHaveProperty("dayOfWeek", 1);
			expect(result[0]).toHaveProperty("startHour", 8);
			expect(result[0]).toHaveProperty("endHour", 12);
		});
	});

	describe("findById (interface pública)", () => {
		it("deve retornar null quando disponibilidade não existe", async () => {
			const nonExistentId = randomUUID();
			
			const result = await repository.findById(nonExistentId);
			
			expect(result).toBeNull();
		});

		it("deve retornar disponibilidade por ID", async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;
			
			const result = await repository.findById(availabilityId);
			
			expect(result).toMatchObject({
				id: availabilityId,
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});
		});

		it("deve retornar tipo DoctorAvailabilityDTO", async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;
			
			const result = await repository.findById(availabilityId);
			
			expect(result).toHaveProperty("id");
			expect(result).toHaveProperty("doctorId");
			expect(result).toHaveProperty("dayOfWeek");
			expect(result).toHaveProperty("startHour");
			expect(result).toHaveProperty("endHour");
			expect(typeof result?.id).toBe("string");
			expect(typeof result?.doctorId).toBe("string");
			expect(typeof result?.dayOfWeek).toBe("number");
			expect(typeof result?.startHour).toBe("number");
			expect(typeof result?.endHour).toBe("number");
		});
	});

	describe("deleteById", () => {
		it("deve retornar false quando tentar deletar disponibilidade inexistente", async () => {
			const nonExistentId = randomUUID();
			
			const result = await repository.deleteById(nonExistentId);
			
			expect(result).toBe(false);
		});

		it("deve deletar disponibilidade existente e retornar true", async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;
			
			const result = await repository.deleteById(availabilityId);
			
			expect(result).toBe(true);
			expect(repository.count()).toBe(0);
		});

		it("deve deletar apenas a disponibilidade específica", async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			await repository.create({
				doctorId,
				dayOfWeek: 2,
				startHour: 14,
				endHour: 18,
			});

			const availabilities = repository.findAll();
			const firstAvailabilityId = availabilities[0].id;
			
			const result = await repository.deleteById(firstAvailabilityId);
			
			expect(result).toBe(true);
			expect(repository.count()).toBe(1);
			
			const remainingAvailability = repository.findByIdSync(firstAvailabilityId);
			expect(remainingAvailability).toBeNull();
		});
	});

	describe("deleteByDoctorId", () => {
		it("deve retornar 0 quando médico não tem disponibilidades", async () => {
			const doctorId = randomUUID();
			
			const result = await repository.deleteByDoctorId(doctorId);
			
			expect(result).toBe(0);
		});

		it("deve deletar todas as disponibilidades de um médico e retornar o count", async () => {
			const doctor1Id = randomUUID();
			const doctor2Id = randomUUID();
			
			// Criar disponibilidades para o primeiro médico
			await repository.create({
				doctorId: doctor1Id,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			await repository.create({
				doctorId: doctor1Id,
				dayOfWeek: 2,
				startHour: 14,
				endHour: 18,
			});

			// Criar disponibilidade para o segundo médico
			await repository.create({
				doctorId: doctor2Id,
				dayOfWeek: 3,
				startHour: 9,
				endHour: 17,
			});

			const result = await repository.deleteByDoctorId(doctor1Id);
			
			expect(result).toBe(2);
			expect(repository.count()).toBe(1);
			
			const doctor1Availabilities = await repository.findByDoctorId(doctor1Id);
			const doctor2Availabilities = await repository.findByDoctorId(doctor2Id);
			
			expect(doctor1Availabilities).toHaveLength(0);
			expect(doctor2Availabilities).toHaveLength(1);
		});

		it("deve preservar disponibilidades de outros médicos", async () => {
			const doctor1Id = randomUUID();
			const doctor2Id = randomUUID();
			const doctor3Id = randomUUID();
			
			await repository.create({
				doctorId: doctor1Id,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			await repository.create({
				doctorId: doctor2Id,
				dayOfWeek: 2,
				startHour: 14,
				endHour: 18,
			});

			await repository.create({
				doctorId: doctor3Id,
				dayOfWeek: 3,
				startHour: 9,
				endHour: 17,
			});

			const result = await repository.deleteByDoctorId(doctor2Id);
			
			expect(result).toBe(1);
			expect(repository.count()).toBe(2);
			
			const doctor1Availabilities = await repository.findByDoctorId(doctor1Id);
			const doctor2Availabilities = await repository.findByDoctorId(doctor2Id);
			const doctor3Availabilities = await repository.findByDoctorId(doctor3Id);
			
			expect(doctor1Availabilities).toHaveLength(1);
			expect(doctor2Availabilities).toHaveLength(0);
			expect(doctor3Availabilities).toHaveLength(1);
		});
	});

	describe("update", () => {
		it("deve retornar false quando tentar atualizar disponibilidade inexistente", async () => {
			const nonExistentId = randomUUID();
			const updateData: UpdateDoctorAvailabilityDTO = {
				dayOfWeek: 2,
			};
			
			const result = await repository.update(nonExistentId, updateData);
			
			expect(result).toBe(false);
		});

		it("deve atualizar disponibilidade existente e retornar true", async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;
			
			const updateData: UpdateDoctorAvailabilityDTO = {
				dayOfWeek: 2,
				startHour: 9,
				endHour: 13,
			};
			
			const result = await repository.update(availabilityId, updateData);
			
			expect(result).toBe(true);
			
			const updatedAvailability = repository.findByIdSync(availabilityId);
			expect(updatedAvailability).toMatchObject({
				id: availabilityId,
				doctorId,
				dayOfWeek: 2,
				startHour: 9,
				endHour: 13,
			});
		});

		it("deve atualizar apenas os campos fornecidos", async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;
			
			const updateData: UpdateDoctorAvailabilityDTO = {
				startHour: 9,
			};
			
			const result = await repository.update(availabilityId, updateData);
			
			expect(result).toBe(true);
			
			const updatedAvailability = repository.findByIdSync(availabilityId);
			expect(updatedAvailability).toMatchObject({
				id: availabilityId,
				doctorId,
				dayOfWeek: 1, // Não alterado
				startHour: 9, // Alterado
				endHour: 12, // Não alterado
			});
		});

		it("deve manter campos não fornecidos inalterados", async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			const availabilities = repository.findAll();
			const availabilityId = availabilities[0].id;
			const originalAvailability = { ...availabilities[0] };
			
			const updateData: UpdateDoctorAvailabilityDTO = {
				endHour: 14,
			};
			
			await repository.update(availabilityId, updateData);
			
			const updatedAvailability = repository.findByIdSync(availabilityId);
			expect(updatedAvailability?.id).toBe(originalAvailability.id);
			expect(updatedAvailability?.doctorId).toBe(originalAvailability.doctorId);
			expect(updatedAvailability?.dayOfWeek).toBe(originalAvailability.dayOfWeek);
			expect(updatedAvailability?.startHour).toBe(originalAvailability.startHour);
			expect(updatedAvailability?.endHour).toBe(14);
		});
	});

	describe("métodos auxiliares", () => {
		beforeEach(async () => {
			const doctorId = randomUUID();
			
			await repository.create({
				doctorId,
				dayOfWeek: 1,
				startHour: 8,
				endHour: 12,
			});

			await repository.create({
				doctorId,
				dayOfWeek: 2,
				startHour: 14,
				endHour: 18,
			});
		});

		describe("clear", () => {
			it("deve limpar todos os dados do repositório", () => {
				expect(repository.count()).toBe(2);
				
				repository.clear();
				
				expect(repository.count()).toBe(0);
				expect(repository.findAll()).toEqual([]);
			});
		});

		describe("count", () => {
			it("deve retornar o número correto de disponibilidades", () => {
				expect(repository.count()).toBe(2);
			});
		});

		describe("findAll", () => {
			it("deve retornar todas as disponibilidades", () => {
				const all = repository.findAll();
				
				expect(all).toHaveLength(2);
				expect(all[0]).toHaveProperty("id");
				expect(all[1]).toHaveProperty("id");
			});

			it("deve retornar uma cópia dos dados", () => {
				const all1 = repository.findAll();
				const all2 = repository.findAll();
				
				expect(all1).not.toBe(all2);
				expect(all1).toEqual(all2);
			});
		});

		describe("findByIdSync", () => {
			it("deve retornar disponibilidade por ID", () => {
				const all = repository.findAll();
				const firstId = all[0].id;
				
				const found = repository.findByIdSync(firstId);
				
				expect(found).toEqual(all[0]);
			});

			it("deve retornar null para ID inexistente", () => {
				const nonExistentId = randomUUID();
				
				const found = repository.findByIdSync(nonExistentId);
				
				expect(found).toBeNull();
			});
		});
	});
});
