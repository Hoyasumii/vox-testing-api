# HTTP Error Classes

Este diretório contém classes de erro padronizadas baseadas nos principais códigos de status HTTP.

## Classes Disponíveis

### 4xx - Erros do Cliente

- **BadRequestError (400)** - Solicitação malformada
- **UnauthorizedError (401)** - Não autenticado
- **ForbiddenError (403)** - Não autorizado (autenticado mas sem permissão)
- **NotFoundError (404)** - Recurso não encontrado
- **MethodNotAllowedError (405)** - Método HTTP não permitido
- **ConflictError (409)** - Conflito de recursos
- **UnprocessableEntityError (422)** - Entidade não processável
- **TooManyRequestsError (429)** - Muitas solicitações

### 5xx - Erros do Servidor

- **InternalServerError (500)** - Erro interno do servidor
- **ServiceUnavailableError (503)** - Serviço indisponível

## Exemplos de Uso

### Usando as Classes Diretamente

```typescript
import { 
  BadRequestError, 
  NotFoundError, 
  UnauthorizedError 
} from '../errors';

// Usando com mensagem padrão
throw new BadRequestError();

// Usando com mensagem customizada
throw new NotFoundError('Usuário não encontrado');

// Em um controller
export class UserController {
  async findUser(id: string) {
    if (!id) {
      throw new BadRequestError('ID é obrigatório');
    }
    
    const user = await this.userService.findById(id);
    
    if (!user) {
      throw new NotFoundError(`Usuário com ID ${id} não encontrado`);
    }
    
    return user;
  }
}

// Em um middleware de autenticação
export class AuthMiddleware {
  validateToken(token: string) {
    if (!token) {
      throw new UnauthorizedError('Token de acesso requerido');
    }
    
    if (!this.isValidToken(token)) {
      throw new UnauthorizedError('Token inválido');
    }
  }
}
```

### Usando ErrorThrowers (Tabela Hash)

```typescript
import { ErrorThrowers } from '../errors';

// Usando com mensagem padrão
ErrorThrowers.badRequest(); // throws BadRequestError

// Usando com mensagem customizada
ErrorThrowers.notFound('Usuário não encontrado'); // throws NotFoundError

// Exemplos práticos
export class UserService {
  async createUser(userData: CreateUserDTO) {
    // Validação
    if (!userData.email) {
      ErrorThrowers.badRequest('Email é obrigatório');
    }
    
    // Verificar se já existe
    const existingUser = await this.findByEmail(userData.email);
    if (existingUser) {
      ErrorThrowers.conflict('Email já está em uso');
    }
    
    // Criar usuário
    try {
      return await this.userRepository.create(userData);
    } catch (error) {
      ErrorThrowers.internalServer('Falha ao criar usuário');
    }
  }
  
  async findById(id: string) {
    if (!id) {
      ErrorThrowers.badRequest('ID é obrigatório');
    }
    
    const user = await this.userRepository.findById(id);
    if (!user) {
      ErrorThrowers.notFound(`Usuário com ID ${id} não encontrado`);
    }
    
    return user;
  }
}

// Em um middleware de rate limiting
export class RateLimitMiddleware {
  checkLimit(userId: string) {
    const requests = this.getRequestCount(userId);
    
    if (requests > this.maxRequests) {
      ErrorThrowers.tooManyRequests('Limite de requisições excedido');
    }
  }
}
```

### ErrorThrowers - Métodos Disponíveis

A tabela hash `ErrorThrowers` contém os seguintes métodos:

- `ErrorThrowers.badRequest(message?)` - Lança BadRequestError (400)
- `ErrorThrowers.unauthorized(message?)` - Lança UnauthorizedError (401)
- `ErrorThrowers.forbidden(message?)` - Lança ForbiddenError (403)
- `ErrorThrowers.notFound(message?)` - Lança NotFoundError (404)
- `ErrorThrowers.methodNotAllowed(message?)` - Lança MethodNotAllowedError (405)
- `ErrorThrowers.conflict(message?)` - Lança ConflictError (409)
- `ErrorThrowers.unprocessableEntity(message?)` - Lança UnprocessableEntityError (422)
- `ErrorThrowers.tooManyRequests(message?)` - Lança TooManyRequestsError (429)
- `ErrorThrowers.internalServer(message?)` - Lança InternalServerError (500)
- `ErrorThrowers.serviceUnavailable(message?)` - Lança ServiceUnavailableError (503)

## Estrutura Base

Todas as classes estendem `ApplicationError`, que por sua vez estende `Error`. Cada classe possui:

- **name**: Nome da classe de erro
- **status**: Código de status HTTP
- **message**: Mensagem de erro (pode ser customizada)

## Testando

```bash
# Executar todos os testes de erro
pnpm test src/errors/

# Executar teste específico
pnpm test src/errors/bad-request.error.spec.ts

# Executar testes do ErrorThrowers
pnpm test src/errors/error-throwers.spec.ts
```
