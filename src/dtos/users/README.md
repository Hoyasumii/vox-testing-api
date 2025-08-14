# User DTOs

Este diretório contém os DTOs (Data Transfer Objects) para operações relacionadas a usuários, implementados usando Zod para validação.

## Estrutura de Arquivos

```
src/dtos/users/
├── user-types.ts           # Constantes compartilhadas (UserType)
├── create-user.dto.ts      # DTO para criação
├── update-user.dto.ts      # DTO para atualização
├── user-response.dto.ts    # DTO para resposta
├── get-user-by-id.dto.ts   # DTO para busca por ID
├── get-user-by-email.dto.ts # DTO para busca por email
├── delete-user.dto.ts      # DTO para deleção
└── index.ts               # Exportações centralizadas
```

## Schemas Disponíveis

### UserType (user-types.ts)
Enum compartilhado para tipos de usuário.
- **Valores**: "DOCTOR" | "PATIENT"

### CreateUserDto
Para criação de novos usuários.

**Campos:**
- `name`: string (obrigatório, mínimo 1 caractere)
- `email`: string (obrigatório, formato de email válido)
- `password`: string (obrigatório, mínimo 8 caracteres)
- `type`: UserType ("DOCTOR" | "PATIENT")

### UpdateUserDto
Para atualização de dados do usuário.

**Campos (todos opcionais):**
- `name`: string (mínimo 1 caractere)
- `email`: string (formato de email válido)
- `type`: UserType ("DOCTOR" | "PATIENT")

**Nota:** Por segurança, a senha não pode ser atualizada através deste DTO.

### UserResponseDto
Para retorno de dados do usuário (sem senha).

**Campos:**
- `id`: string (UUID)
- `name`: string
- `email`: string (formato de email)
- `type`: UserType ("DOCTOR" | "PATIENT")
- `createdAt`: Date
- `updatedAt`: Date

### GetUserByIdDto
Para buscar usuário por ID.

**Campos:**
- `id`: string (UUID válido)

### GetUserByEmailDto
Para buscar usuário por email.

**Campos:**
- `email`: string (formato de email válido)

### DeleteUserDto
Para deletar usuário por ID.

**Campos:**
- `id`: string (UUID válido)

## Facilidades de Consumo

### Mesmo Nome para Constante e Tipo
```typescript
// Intuitivo - CreateUserDto é tanto o schema quanto o tipo!
import { CreateUserDto } from './dtos/users';

const result = CreateUserDto.safeParse(data); // Schema
const user: CreateUserDto = result.data; // Tipo
```

### Constantes Separadas
```typescript
// UserType em arquivo separado para reutilização
import { UserType } from './dtos/users';
const userType: UserType = "DOCTOR";
```

### Importação Simplificada
```typescript
import { 
  UserType,
  CreateUserDto, 
  UpdateUserDto, 
  UserResponseDto 
} from '@/dtos/users';
```

## Schemas Disponíveis

### CreateUserSchema
Para criação de novos usuários.

**Campos:**
- `name`: string (obrigatório, mínimo 1 caractere)
- `email`: string (obrigatório, formato de email válido)
- `password`: string (obrigatório, mínimo 8 caracteres)
- `type`: enum ("DOCTOR" | "PATIENT")

### UpdateUserSchema
Para atualização de dados do usuário.

**Campos (todos opcionais):**
- `name`: string (mínimo 1 caractere)
- `email`: string (formato de email válido)
- `type`: enum ("DOCTOR" | "PATIENT")

**Nota:** Por segurança, a senha não pode ser atualizada através deste DTO.

### UserResponseSchema
Para retorno de dados do usuário (sem senha).

**Campos:**
- `id`: string (UUID)
- `name`: string
- `email`: string (formato de email)
- `type`: enum ("DOCTOR" | "PATIENT")
- `createdAt`: Date
- `updatedAt`: Date

### GetUserByIdSchema
Para buscar usuário por ID.

**Campos:**
- `id`: string (UUID válido)

### GetUserByEmailSchema
Para buscar usuário por email.

**Campos:**
- `email`: string (formato de email válido)

### DeleteUserSchema
Para deletar usuário por ID.

**Campos:**
- `id`: string (UUID válido)

## Exemplos de Uso

### Validação de Dados

```typescript
import { CreateUserSchema } from '@/dtos/users';

const userData = {
  name: "João Silva",
  email: "joao@email.com",
  password: "senha123456",
  type: "DOCTOR"
};

// Validação
const result = CreateUserSchema.safeParse(userData);

if (result.success) {
  // Dados válidos
  const validatedData = result.data;
  console.log(validatedData);
} else {
  // Dados inválidos
  console.error(result.error.issues);
}
```

### Parsing com Tratamento de Erro

```typescript
import { CreateUserSchema } from '@/dtos/users';
import { BadRequestError } from '@/errors';

function createUser(userData: unknown) {
  try {
    const validatedData = CreateUserSchema.parse(userData);
    // Proceder com a criação do usuário
    return userService.create(validatedData);
  } catch (error) {
    throw new BadRequestError('Dados de usuário inválidos');
  }
}
```

### Em Controllers

```typescript
import { CreateUserSchema, UpdateUserSchema } from '@/dtos/users';
import { BadRequestError } from '@/errors';

export class UserController {
  async create(req: Request, res: Response) {
    const validation = CreateUserSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw new BadRequestError('Dados inválidos');
    }
    
    const user = await this.userService.create(validation.data);
    return res.json(user);
  }
  
  async update(req: Request, res: Response) {
    const validation = UpdateUserSchema.safeParse(req.body);
    
    if (!validation.success) {
      throw new BadRequestError('Dados inválidos');
    }
    
    const user = await this.userService.update(req.params.id, validation.data);
    return res.json(user);
  }
}
```

## Testando

```bash
# Executar todos os testes dos DTOs de usuários
pnpm test src/dtos/users/

# Executar testes específicos por DTO
pnpm test src/dtos/users/create-user.dto.spec.ts
pnpm test src/dtos/users/update-user.dto.spec.ts
pnpm test src/dtos/users/user-response.dto.spec.ts
pnpm test src/dtos/users/get-user-by-id.dto.spec.ts
pnpm test src/dtos/users/get-user-by-email.dto.spec.ts
pnpm test src/dtos/users/delete-user.dto.spec.ts
```

### Arquivos de Teste

Cada DTO possui seu próprio arquivo de teste:

- **create-user.dto.spec.ts** - Testa validações de criação de usuário
- **update-user.dto.spec.ts** - Testa validações de atualização
- **user-response.dto.spec.ts** - Testa estrutura de resposta
- **get-user-by-id.dto.spec.ts** - Testa validação de UUID
- **get-user-by-email.dto.spec.ts** - Testa validação de email
- **delete-user.dto.spec.ts** - Testa validação para deleção

## Segurança

- O campo `password` é excluído do `UserResponseSchema` para evitar vazamento de dados sensíveis
- O `UpdateUserSchema` não permite atualização direta da senha
- Todos os IDs são validados como UUIDs válidos
- Emails são validados quanto ao formato
- Senhas devem ter pelo menos 8 caracteres
