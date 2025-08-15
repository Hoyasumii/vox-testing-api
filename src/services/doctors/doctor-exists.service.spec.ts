import { DoctorExistsService } from "./doctor-exists.service";
import { DoctorsRepository } from "../../../test/repositories/doctors.repository";
import { MemoryCache } from "../../../test/cache";

describe("DoctorExistsService", () => {
	let service: DoctorExistsService;
	let repository: DoctorsRepository;
	let cache: MemoryCache;

	beforeEach(() => {
		cache = new MemoryCache();
		repository = new DoctorsRepository(cache);
		service = new DoctorExistsService(repository);
	});

	describe("run", () => {
		it("deve retornar true quando o médico existe", async () => {
			// Arrange
			const doctorId = "550e8400-e29b-41d4-a716-446655440000";
			await repository.create(doctorId);

			// Act
			const result = await service.run(doctorId);

			// Assert
			expect(result).toBe(true);
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

		it("deve retornar false para múltiplos médicos quando o id específico não existe", async () => {
			// Arrange
			await repository.create("550e8400-e29b-41d4-a716-446655440001");
			await repository.create("550e8400-e29b-41d4-a716-446655440002");
			const nonExistentId = "550e8400-e29b-41d4-a716-446655440999";

			// Act
			const result = await service.run(nonExistentId);

			// Assert
			expect(result).toBe(false);
		});

		it("deve distinguir entre diferentes UUIDs válidos", async () => {
			// Arrange
			const doctorId1 = "550e8400-e29b-41d4-a716-446655440001";
			const doctorId2 = "550e8400-e29b-41d4-a716-446655440002";
			await repository.create(doctorId1);

			// Act
			const existsResult = await service.run(doctorId1);
			const notExistsResult = await service.run(doctorId2);

			// Assert
			expect(existsResult).toBe(true);
			expect(notExistsResult).toBe(false);
		});
	});
});
