# Test Factories

Este diretório contém as factories de teste que instanciam os serviços usando as implementações em memória dos repositórios e cache, especialmente voltadas para testes unitários.

## Estrutura

As test factories seguem a mesma estrutura das factories de produção em `src/factories`, mas utilizam:
- `MemoryCache` em vez de `RedisCache`
- Repositories de teste em memória em vez dos repositories do Prisma

## Uso

```typescript
import { makeCreateUserFactory } from "@/test/factories";

// Em um teste unitário
const createUserService = makeCreateUserFactory();
const result = await createUserService.execute(userData);
```

## Factories Disponíveis

### Hello World
- `makeHelloWorldFactory` - Factory para o serviço Hello World

### Users
- `makeCreateUserFactory` - Factory para criação de usuários
- `makeAuthenticateUserFactory` - Factory para autenticação de usuários
- `makeDeleteUserFactory` - Factory para exclusão de usuários
- `makeGetUserContentByIdFactory` - Factory para busca de usuário por ID
- `makeUpdateUserFactory` - Factory para atualização de usuários

### Doctors
- `makeCreateDoctorFactory` - Factory para criação de médicos
- `makeDeleteDoctorFactory` - Factory para exclusão de médicos
- `makeDoctorExistsFactory` - Factory para verificação de existência de médicos

### Doctors Availability
- `makeCreateDoctorAvailabilityFactory` - Factory para criação de disponibilidade de médicos
- `makeFindByDoctorIdFactory` - Factory para busca de disponibilidade por ID do médico
- `makeUpdateDoctorAvailabilityFactory` - Factory para atualização de disponibilidade
- `makeDeleteDoctorAvailabilityByIdFactory` - Factory para exclusão de disponibilidade por ID
- `makeDeleteDoctorAvailabilityByDoctorIdFactory` - Factory para exclusão de disponibilidade por ID do médico

## Vantagens

1. **Isolamento**: Cada teste usa instâncias isoladas em memória
2. **Performance**: Não depende de banco de dados externo ou Redis
3. **Simplicidade**: Não requer configuração de ambiente externo
4. **Determinismo**: Resultados previsíveis e repetíveis
