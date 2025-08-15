# Cache para Testes Unitários

Este diretório contém implementações de cache para uso em testes unitários, eliminando a dependência do Redis durante os testes.

## MemoryCache

O `MemoryCache` é uma implementação em memória da interface `CacheBase` que simula o comportamento do Redis Cache sem a necessidade de uma instância Redis real.

### Características

- **Compatibilidade total**: Implementa a mesma interface `CacheBase` do `RedisCache`
- **Suporte a expiração**: Gerencia automaticamente a expiração de chaves com base no tempo
- **Tipos suportados**: String, Number e Buffer (mesmos tipos do Redis)
- **Métodos adicionais para testes**: Inclui métodos auxiliares para facilitar os testes

### Uso

```typescript
import { MemoryCache } from "@/test/cache";

const cache = new MemoryCache();

// Operações básicas
await cache.set("key", "value");
const value = await cache.get("key");

// Com expiração (em segundos)
await cache.set("expiring-key", "value", 10);

// Métodos auxiliares para testes
cache.clear(); // Limpa todo o cache
cache.size(); // Retorna número de entradas
cache.has("key"); // Verifica se a chave existe
cache.cleanExpired(); // Remove entradas expiradas
```

### Métodos Adicionais

Além dos métodos da interface `CacheBase`, o `MemoryCache` inclui métodos úteis para testes:

- `clear()`: Remove todas as entradas do cache
- `size()`: Retorna o número de entradas no cache
- `has(key)`: Verifica se uma chave existe (e não está expirada)
- `cleanExpired()`: Remove manualmente todas as entradas expiradas

### Exemplo de Uso em Testes

```typescript
describe("Meu Service", () => {
  let cache: CacheBase;
  
  beforeEach(() => {
    cache = new MemoryCache();
  });
  
  afterEach(() => {
    (cache as MemoryCache).clear();
  });
  
  it("deve cachear resultados", async () => {
    const service = new MeuService(cache);
    
    await service.salvarDados("key", "dados");
    const dados = await service.obterDados("key");
    
    expect(dados).toBe("dados");
  });
});
```

### Diferenças do Redis

O `MemoryCache` mantém compatibilidade com o comportamento do Redis, mas algumas diferenças são esperadas:

1. **Persistência**: Os dados são perdidos quando o processo termina (comportamento esperado para testes)
2. **Serialização**: Objetos complexos não são automaticamente serializados/deserializados
3. **Performance**: Operações são síncronas internamente, mas mantêm interface assíncrona

### Executando os Testes

```bash
# Executar apenas os testes do cache
pnpm test test/cache/memory-cache.spec.ts

# Executar todos os testes
pnpm test

# Executar com coverage
pnpm test:coverage
```

## Estrutura de Arquivos

```
test/cache/
├── index.ts              # Exportações principais
├── memory-cache.ts       # Implementação do MemoryCache
├── memory-cache.spec.ts  # Testes unitários
└── README.md            # Esta documentação
```
