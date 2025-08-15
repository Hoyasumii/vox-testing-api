import type { CacheBase } from "@/cache/cache-base";

type RedisValue = string | number | Buffer<ArrayBufferLike>;

interface CacheEntry {
	value: RedisValue;
	expiresAt?: number;
}

export class MemoryCache implements CacheBase {
	private cache = new Map<string, CacheEntry>();

	async set<ContentType extends RedisValue>(
		key: string,
		value: ContentType,
		ex?: number,
	): Promise<void> {
		const entry: CacheEntry = {
			value,
			expiresAt: ex ? Date.now() + ex * 1000 : undefined,
		};

		this.cache.set(key, entry);
	}

	async get<ContentType = unknown>(key: string): Promise<ContentType | null> {
		const entry = this.cache.get(key);

		if (!entry) {
			return null;
		}

		// Verifica se a entrada expirou
		if (entry.expiresAt && Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			return null;
		}

		return entry.value as ContentType;
	}

	async del(key: string): Promise<boolean> {
		const entry = this.cache.get(key);
		
		if (!entry) {
			return false;
		}

		// Verifica se a entrada expirou
		if (entry.expiresAt && Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			return false;
		}

		return this.cache.delete(key);
	}

	/**
	 * Método adicional para testes - limpa todo o cache
	 */
	clear(): void {
		this.cache.clear();
	}

	/**
	 * Método adicional para testes - retorna o tamanho do cache
	 */
	size(): number {
		return this.cache.size;
	}

	/**
	 * Método adicional para testes - verifica se uma chave existe
	 */
	has(key: string): boolean {
		const entry = this.cache.get(key);
		
		if (!entry) {
			return false;
		}

		// Verifica se a entrada expirou
		if (entry.expiresAt && Date.now() > entry.expiresAt) {
			this.cache.delete(key);
			return false;
		}

		return true;
	}

	/**
	 * Método adicional para testes - força a expiração de entradas
	 */
	cleanExpired(): void {
		const now = Date.now();
		
		for (const [key, entry] of this.cache.entries()) {
			if (entry.expiresAt && now > entry.expiresAt) {
				this.cache.delete(key);
			}
		}
	}
}
