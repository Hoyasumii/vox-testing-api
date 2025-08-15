import { DeleteDoctorService } from "./delete-doctor.service";
import { DoctorsRepository } from "../../../test/repositories/doctors.repository";
import { MemoryCache } from "../../../test/cache";

describe("DeleteDoctorService", () => {
	let service: DeleteDoctorService;
	let repository: DoctorsRepository;
	let cache: MemoryCache;

	beforeEach(() => {
		cache = new MemoryCache();
		repository = new DoctorsRepository(cache);
		service = new DeleteDoctorService(repository);
	});

	describe("run", () => {
		it("deve retornar true quando o médico é deletado com sucesso", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			await repository.create(doctorId);

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toBe(true);
			expect(await repository.exists(doctorId)).toBe(false);
		});

		it("deve retornar false quando o médico não existe", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toBe(false);
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

		it("deve decrementar o contador de médicos após deleção bem-sucedida", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			await repository.create(doctorId);
			const initialCount = repository.count();

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toBe(true);
			expect(repository.count()).toBe(initialCount - 1);
		});

		it("deve deletar apenas o médico específico", async () => {
			// Arrange
			const doctorId1 = "550e8400-e29b-41d4-a716-446655440001";
			const doctorId2 = "550e8400-e29b-41d4-a716-446655440002";
			await repository.create(doctorId1);
			await repository.create(doctorId2);

			// Act
			const result = await service.run(doctorId1);

			// Assert
			expect(result).toBe(true);
			expect(await repository.exists(doctorId1)).toBe(false);
			expect(await repository.exists(doctorId2)).toBe(true);
			expect(repository.count()).toBe(1);
		});

		it("deve retornar false ao tentar deletar o mesmo médico duas vezes", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			await repository.create(doctorId);

			// Act
			const firstDelete = await service.run(doctorId);
			const secondDelete = await service.run(doctorId);

			// Assert
			expect(firstDelete).toBe(true);
			expect(secondDelete).toBe(false);
		});

		it("deve manter o contador em zero quando não há médicos para deletar", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			const initialCount = repository.count();

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toBe(false);
			expect(repository.count()).toBe(initialCount);
		});

		it("deve deletar múltiplos médicos sequencialmente", async () => {
			// Arrange
			const doctorIds = [
				"550e8400-e29b-41d4-a716-446655440001",
				"550e8400-e29b-41d4-a716-446655440002",
				"550e8400-e29b-41d4-a716-446655440003"
			];
			
			for (const id of doctorIds) {
				await repository.create(id);
			}

			// Act
			const results: boolean[] = [];
			for (const id of doctorIds) {
				results.push(await service.run(id));
			}

			// Assert
			expect(results).toEqual([true, true, true]);
			expect(repository.count()).toBe(0);
		});
	});
});
