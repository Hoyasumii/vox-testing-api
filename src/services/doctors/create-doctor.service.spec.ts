import { CreateDoctorService } from "./create-doctor.service";
import { DoctorsRepository } from "../../../test/repositories/doctors.repository";
import { MemoryCache } from "../../../test/cache";

describe("CreateDoctorService", () => {
	let service: CreateDoctorService;
	let repository: DoctorsRepository;
	let cache: MemoryCache;

	beforeEach(() => {
		cache = new MemoryCache();
		repository = new DoctorsRepository(cache);
		service = new CreateDoctorService(repository);
	});

	describe("run", () => {
		it("deve retornar true quando o médico é criado com sucesso", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toBe(true);
			expect(repository.exists(doctorId)).resolves.toBe(true);
		});

		it("deve retornar BadRequestError quando o id não é um UUID válido", async () => {
			// Arrange
			const invalidId = "invalid-uuid";

			// Act & Assert
			await expect(service.run(invalidId)).rejects.toThrow();
		});

		it("deve retornar BadRequestError quando o id está vazio", async () => {
			// Arrange
			const emptyId = "";

			// Act & Assert
			await expect(service.run(emptyId)).rejects.toThrow();
		});

		it("deve incrementar o contador de médicos após criação bem-sucedida", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			const initialCount = repository.count();

			// Act
			await service.run(doctorId);

			// Assert
			expect(repository.count()).toBe(initialCount + 1);
		});

		it("deve criar médicos com IDs únicos diferentes", async () => {
			// Arrange
			const doctorId1 = "550e8400-e29b-41d4-a716-446655440001";
			const doctorId2 = "550e8400-e29b-41d4-a716-446655440002";

			// Act
			const result1 = await service.run(doctorId1);
			const result2 = await service.run(doctorId2);

			// Assert
			expect(result1).toBe(true);
			expect(result2).toBe(true);
			expect(repository.count()).toBe(2);
			expect(await repository.exists(doctorId1)).toBe(true);
			expect(await repository.exists(doctorId2)).toBe(true);
		});

		it("deve permitir criação de múltiplos médicos sequencialmente", async () => {
			// Arrange
			const doctorIds = [
				"550e8400-e29b-41d4-a716-446655440001",
				"550e8400-e29b-41d4-a716-446655440002",
				"550e8400-e29b-41d4-a716-446655440003"
			];

			// Act
			const results: boolean[] = [];
			for (const id of doctorIds) {
				results.push(await service.run(id));
			}

			// Assert
			expect(results).toEqual([true, true, true]);
			expect(repository.count()).toBe(3);
		});

		it("deve retornar false quando ocorre erro no repositório", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			// Simulando erro no repositório
			jest.spyOn(repository, 'create').mockRejectedValue(new Error("Database error"));

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toBe(false);
		});
	});
});
