# Factories

Este diretório contém as factories responsáveis por criar instâncias dos serviços com suas dependências já configuradas.

## Factories de Usuários

### makeCreateUserFactory()
Cria uma instância do `CreateUserService` com o repositório Prisma de usuários.

**Uso:**
```typescript
import { makeCreateUserFactory } from "@/factories";

const createUserService = makeCreateUserFactory();
const newUserId = await createUserService.run(userData);
```

### makeAuthenticateUserFactory()
Cria uma instância do `AuthenticateUserService` com o repositório Prisma de usuários.

**Uso:**
```typescript
import { makeAuthenticateUserFactory } from "@/factories";

const authenticateUserService = makeAuthenticateUserFactory();
const token = await authenticateUserService.run(credentials);
```

### makeDeleteUserFactory()
Cria uma instância do `DeleteUserService` com o repositório Prisma de usuários.

**Uso:**
```typescript
import { makeDeleteUserFactory } from "@/factories";

const deleteUserService = makeDeleteUserFactory();
const success = await deleteUserService.run(userId);
```

### makeGetUserContentByIdFactory()
Cria uma instância do `GetUserContentByIdService` com o repositório Prisma de usuários.

**Uso:**
```typescript
import { makeGetUserContentByIdFactory } from "@/factories";

const getUserService = makeGetUserContentByIdFactory();
const user = await getUserService.run(userId);
```

### makeUpdateUserFactory()
Cria uma instância do `UpdateUserService` com o repositório Prisma de usuários.

**Uso:**
```typescript
import { makeUpdateUserFactory } from "@/factories";

const updateUserService = makeUpdateUserFactory();
const success = await updateUserService.run({ id: userId, data: updateData });
```

## Factory Agregada

### makeUsersFactory (via make-users.factory.ts)
Arquivo que exporta todas as factories de usuários em um só lugar, permitindo importação centralizada.

## Padrão de Uso

Todas as factories seguem o mesmo padrão:
1. Criam uma nova instância do repositório Prisma específico
2. Injetam essa dependência no serviço correspondente
3. Retornam a instância configurada do serviço

Isso garante que cada serviço tenha acesso às operações de banco de dados através do Prisma, mantendo a separação de responsabilidades e facilitando os testes unitários.
