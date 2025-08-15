import { MemoryCache } from "./memory-cache";

describe("MemoryCache", () => {
	let cache: MemoryCache;

	beforeAll(() => {
		// Configura timers fake para testar expiração
		jest.useFakeTimers();
	});

	afterAll(() => {
		// Restaura timers reais
		jest.useRealTimers();
	});

	beforeEach(() => {
		cache = new MemoryCache();
	});

	afterEach(() => {
		cache.clear();
		// Limpa todos os timers pendentes
		jest.clearAllTimers();
	});

	describe("set", () => {
		it("deve armazenar um valor string", async () => {
			await cache.set("test-key", "test-value");
			
			expect(cache.has("test-key")).toBe(true);
			expect(cache.size()).toBe(1);
		});

		it("deve armazenar um valor numérico", async () => {
			await cache.set("number-key", 42);
			
			expect(cache.has("number-key")).toBe(true);
			expect(cache.size()).toBe(1);
		});

		it("deve armazenar um Buffer", async () => {
			const buffer = Buffer.from("test buffer");
			await cache.set("buffer-key", buffer);
			
			expect(cache.has("buffer-key")).toBe(true);
			expect(cache.size()).toBe(1);
		});

		it("deve armazenar um valor com tempo de expiração", async () => {
			await cache.set("expiring-key", "expiring-value", 1); // 1 segundo
			
			expect(cache.has("expiring-key")).toBe(true);
		});

		it("deve sobrescrever um valor existente", async () => {
			await cache.set("overwrite-key", "original-value");
			await cache.set("overwrite-key", "new-value");
			
			const value = await cache.get("overwrite-key");
			expect(value).toBe("new-value");
			expect(cache.size()).toBe(1);
		});
	});

	describe("get", () => {
		it("deve retornar o valor armazenado", async () => {
			await cache.set("test-key", "test-value");
			
			const value = await cache.get("test-key");
			expect(value).toBe("test-value");
		});

		it("deve retornar null para chave inexistente", async () => {
			const value = await cache.get("non-existent-key");
			expect(value).toBeNull();
		});

		it("deve retornar valor numérico corretamente", async () => {
			await cache.set("number-key", 42);
			
			const value = await cache.get<number>("number-key");
			expect(value).toBe(42);
			expect(typeof value).toBe("number");
		});

		it("deve retornar Buffer corretamente", async () => {
			const originalBuffer = Buffer.from("test buffer");
			await cache.set("buffer-key", originalBuffer);
			
			const value = await cache.get<Buffer>("buffer-key");
			expect(Buffer.isBuffer(value)).toBe(true);
			expect(value?.toString()).toBe("test buffer");
		});

		it("deve retornar null para chave expirada", async () => {
			await cache.set("expiring-key", "expiring-value", 1); // 1 segundo
			
			// Simula a passagem do tempo
			jest.advanceTimersByTime(1500); // 1.5 segundos
			
			const value = await cache.get("expiring-key");
			expect(value).toBeNull();
			expect(cache.has("expiring-key")).toBe(false);
		});

		it("deve retornar valor antes da expiração", async () => {
			await cache.set("expiring-key", "expiring-value", 2); // 2 segundos
			
			// Simula a passagem de menos tempo que a expiração
			jest.advanceTimersByTime(1000); // 1 segundo
			
			const value = await cache.get("expiring-key");
			expect(value).toBe("expiring-value");
		});
	});

	describe("clear", () => {
		it("deve limpar todo o cache", async () => {
			await cache.set("key1", "value1");
			await cache.set("key2", "value2");
			await cache.set("key3", "value3");
			
			expect(cache.size()).toBe(3);
			
			cache.clear();
			
			expect(cache.size()).toBe(0);
			expect(cache.has("key1")).toBe(false);
			expect(cache.has("key2")).toBe(false);
			expect(cache.has("key3")).toBe(false);
		});
	});

	describe("size", () => {
		it("deve retornar 0 para cache vazio", () => {
			expect(cache.size()).toBe(0);
		});

		it("deve retornar o número correto de entradas", async () => {
			await cache.set("key1", "value1");
			expect(cache.size()).toBe(1);
			
			await cache.set("key2", "value2");
			expect(cache.size()).toBe(2);
			
			await cache.set("key3", "value3");
			expect(cache.size()).toBe(3);
		});

		it("deve manter o tamanho correto ao sobrescrever", async () => {
			await cache.set("key1", "value1");
			await cache.set("key1", "new-value");
			
			expect(cache.size()).toBe(1);
		});
	});

	describe("has", () => {
		it("deve retornar true para chave existente", async () => {
			await cache.set("existing-key", "value");
			
			expect(cache.has("existing-key")).toBe(true);
		});

		it("deve retornar false para chave inexistente", () => {
			expect(cache.has("non-existent-key")).toBe(false);
		});

		it("deve retornar false para chave expirada", async () => {
			await cache.set("expiring-key", "expiring-value", 1); // 1 segundo
			
			expect(cache.has("expiring-key")).toBe(true);
			
			// Simula a passagem do tempo
			jest.advanceTimersByTime(1500); // 1.5 segundos
			
			expect(cache.has("expiring-key")).toBe(false);
		});

		it("deve limpar automaticamente chaves expiradas ao verificar", async () => {
			await cache.set("expiring-key", "expiring-value", 1); // 1 segundo
			
			expect(cache.size()).toBe(1);
			
			// Simula a passagem do tempo
			jest.advanceTimersByTime(1500); // 1.5 segundos
			
			cache.has("expiring-key"); // Isso deve limpar a chave expirada
			
			expect(cache.size()).toBe(0);
		});
	});

	describe("del", () => {
		it("deve remover uma chave existente", async () => {
			await cache.set("test-key", "test-value");
			
			expect(cache.has("test-key")).toBe(true);
			expect(cache.size()).toBe(1);
			
			const result = await cache.del("test-key");
			
			expect(result).toBe(true);
			expect(cache.has("test-key")).toBe(false);
			expect(cache.size()).toBe(0);
		});

		it("deve retornar false para chave inexistente", async () => {
			const result = await cache.del("non-existent-key");
			
			expect(result).toBe(false);
		});

		it("deve remover apenas a chave especificada", async () => {
			await cache.set("key1", "value1");
			await cache.set("key2", "value2");
			await cache.set("key3", "value3");
			
			expect(cache.size()).toBe(3);
			
			const result = await cache.del("key2");
			
			expect(result).toBe(true);
			expect(cache.size()).toBe(2);
			expect(cache.has("key1")).toBe(true);
			expect(cache.has("key2")).toBe(false);
			expect(cache.has("key3")).toBe(true);
		});

		it("deve remover chave expirada e retornar false", async () => {
			await cache.set("expiring-key", "expiring-value", 1); // 1 segundo
			
			// Simula a passagem do tempo
			jest.advanceTimersByTime(1500); // 1.5 segundos
			
			const result = await cache.del("expiring-key");
			
			expect(result).toBe(false);
			expect(cache.size()).toBe(0);
		});
	});

	describe("cleanExpired", () => {
		it("deve remover todas as chaves expiradas", async () => {
			await cache.set("key1", "value1", 1); // 1 segundo
			await cache.set("key2", "value2", 3); // 3 segundos
			await cache.set("key3", "value3"); // sem expiração
			
			expect(cache.size()).toBe(3);
			
			// Simula a passagem de 2 segundos
			jest.advanceTimersByTime(2000);
			
			cache.cleanExpired();
			
			expect(cache.size()).toBe(2); // key1 deve ter sido removida
			expect(cache.has("key1")).toBe(false);
			expect(cache.has("key2")).toBe(true);
			expect(cache.has("key3")).toBe(true);
		});

		it("deve manter chaves não expiradas", async () => {
			await cache.set("persistent-key", "persistent-value");
			await cache.set("expiring-key", "expiring-value", 2); // 2 segundos
			
			// Simula a passagem de 1 segundo
			jest.advanceTimersByTime(1000);
			
			cache.cleanExpired();
			
			expect(cache.size()).toBe(2);
			expect(cache.has("persistent-key")).toBe(true);
			expect(cache.has("expiring-key")).toBe(true);
		});

		it("não deve fazer nada se não houver chaves expiradas", async () => {
			await cache.set("key1", "value1");
			await cache.set("key2", "value2", 10); // 10 segundos
			
			cache.cleanExpired();
			
			expect(cache.size()).toBe(2);
			expect(cache.has("key1")).toBe(true);
			expect(cache.has("key2")).toBe(true);
		});
	});

	describe("compatibilidade com CacheBase", () => {
		it("deve implementar a interface CacheBase corretamente", async () => {
			// Testa se pode ser usado como CacheBase
			const cacheBase = cache as any; // CacheBase
			
			await cacheBase.set("interface-key", "interface-value");
			const value = await cacheBase.get("interface-key");
			
			expect(value).toBe("interface-value");
		});

		it("deve funcionar com tipos genéricos", async () => {
			interface TestObject {
				id: number;
				name: string;
			}
			
			// Note: Para objetos, precisaríamos serializar/deserializar
			// mas aqui testamos com tipos primitivos que são suportados
			await cache.set("typed-number", 42);
			await cache.set("typed-string", "hello");
			
			const numberValue = await cache.get<number>("typed-number");
			const stringValue = await cache.get<string>("typed-string");
			
			expect(typeof numberValue).toBe("number");
			expect(typeof stringValue).toBe("string");
			expect(numberValue).toBe(42);
			expect(stringValue).toBe("hello");
		});
	});
});
