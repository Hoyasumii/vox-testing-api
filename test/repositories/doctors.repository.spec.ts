import { randomUUID } from "node:crypto";
import { DoctorsRepository } from "./doctors.repository";
import { MemoryCache } from "../cache";
import { testChannel } from "t/channels";

describe("DoctorsRepository", () => {
	let repository: DoctorsRepository;
	let cache: MemoryCache;

	beforeEach(() => {
		cache = new MemoryCache();
		repository = new DoctorsRepository(cache, testChannel);
	});

	afterEach(() => {
		repository.clear();
		cache.clear();
	});

	describe("create", () => {
		it("should create a doctor with the provided id", async () => {
			const id = randomUUID();

			await repository.create(id);

			const doctors = repository.findAll();
			expect(doctors).toHaveLength(1);
			expect(doctors[0].id).toBe(id);
			expect(doctors[0].createdAt).toBeInstanceOf(Date);
			expect(doctors[0].updatedAt).toBeInstanceOf(Date);
		});

		it("should create multiple doctors with different ids", async () => {
			const id1 = randomUUID();
			const id2 = randomUUID();

			await repository.create(id1);
			await repository.create(id2);

			const doctors = repository.findAll();
			expect(doctors).toHaveLength(2);
			expect(doctors.map(d => d.id)).toContain(id1);
			expect(doctors.map(d => d.id)).toContain(id2);
		});
	});

	describe("exists", () => {
		it("should return true if doctor exists", async () => {
			const id = randomUUID();
			await repository.create(id);

			const exists = await repository.exists(id);

			expect(exists).toBe(true);
		});

		it("should return false if doctor does not exist", async () => {
			const id = randomUUID();

			const exists = await repository.exists(id);

			expect(exists).toBe(false);
		});

		it("should return false for empty repository", async () => {
			const id = randomUUID();

			const exists = await repository.exists(id);

			expect(exists).toBe(false);
		});
	});

	describe("deleteById", () => {
		it("should delete an existing doctor and return true", async () => {
			const id = randomUUID();
			await repository.create(id);

			const deleted = await repository.deleteById(id);

			expect(deleted).toBe(true);
			expect(repository.count()).toBe(0);
			expect(await repository.exists(id)).toBe(false);
		});

		it("should return false when trying to delete non-existing doctor", async () => {
			const id = randomUUID();

			const deleted = await repository.deleteById(id);

			expect(deleted).toBe(false);
			expect(repository.count()).toBe(0);
		});

		it("should only delete the specified doctor", async () => {
			const id1 = randomUUID();
			const id2 = randomUUID();
			await repository.create(id1);
			await repository.create(id2);

			const deleted = await repository.deleteById(id1);

			expect(deleted).toBe(true);
			expect(repository.count()).toBe(1);
			expect(await repository.exists(id1)).toBe(false);
			expect(await repository.exists(id2)).toBe(true);
		});
	});

	describe("clear", () => {
		it("should remove all doctors from repository", async () => {
			const id1 = randomUUID();
			const id2 = randomUUID();
			await repository.create(id1);
			await repository.create(id2);

			repository.clear();

			expect(repository.count()).toBe(0);
			expect(repository.findAll()).toHaveLength(0);
		});

		it("should work on empty repository", () => {
			repository.clear();

			expect(repository.count()).toBe(0);
			expect(repository.findAll()).toHaveLength(0);
		});
	});

	describe("count", () => {
		it("should return 0 for empty repository", () => {
			expect(repository.count()).toBe(0);
		});

		it("should return correct count after adding doctors", async () => {
			const id1 = randomUUID();
			const id2 = randomUUID();

			expect(repository.count()).toBe(0);

			await repository.create(id1);
			expect(repository.count()).toBe(1);

			await repository.create(id2);
			expect(repository.count()).toBe(2);
		});

		it("should return correct count after deleting doctors", async () => {
			const id1 = randomUUID();
			const id2 = randomUUID();
			await repository.create(id1);
			await repository.create(id2);

			expect(repository.count()).toBe(2);

			await repository.deleteById(id1);
			expect(repository.count()).toBe(1);

			await repository.deleteById(id2);
			expect(repository.count()).toBe(0);
		});
	});

	describe("findAll", () => {
		it("should return empty array for empty repository", () => {
			const doctors = repository.findAll();

			expect(doctors).toEqual([]);
			expect(doctors).toHaveLength(0);
		});

		it("should return all doctors", async () => {
			const id1 = randomUUID();
			const id2 = randomUUID();
			await repository.create(id1);
			await repository.create(id2);

			const doctors = repository.findAll();

			expect(doctors).toHaveLength(2);
			expect(doctors.map(d => d.id)).toContain(id1);
			expect(doctors.map(d => d.id)).toContain(id2);
		});

		it("should return a copy of the internal array", async () => {
			const id = randomUUID();
			await repository.create(id);

			const doctors1 = repository.findAll();
			const doctors2 = repository.findAll();

			expect(doctors1).not.toBe(doctors2); // Different references
			expect(doctors1).toEqual(doctors2); // Same content
		});
	});
});
