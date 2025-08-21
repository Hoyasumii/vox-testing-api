# Documentação OpenAPI com Base nos Services

Este documento explica como especificar corretamente os tipos de resposta no OpenAPI baseando-se no comportamento real do sistema.

## 🎯 Comportamento Real do Sistema

### Fluxo de Sucesso (2xx)
```
Service retorna: dados brutos (string, object, etc.)
     ↓
Interceptor StandardizeResponse: { success: true, data: /* dados do service */ }
     ↓
Cliente recebe: { success: true, data: /* dados do service */ }
```

### Fluxo de Erro (4xx/5xx)
```
Service executa: this.repository.errors.badRequest()
     ↓
Exception é lançada: BadRequestError
     ↓
Exception filter formata: { message: "Bad request", statusCode: 400, timestamp: "...", path: "..." }
     ↓
Cliente recebe: { message: "Bad request", statusCode: 400, ... }
```

## 📋 Padrões de Resposta

### ✅ Resposta de Sucesso (via StandardizeResponse interceptor)
```json
{
  "success": true,
  "data": "dados-retornados-pelo-service"
}
```

### ❌ Resposta de Erro (via Exception Filter)
```json
{
  "message": "Mensagem de erro",
  "statusCode": 400,
  "timestamp": "2024-01-15T10:30:00Z",
  "path": "/api/endpoint"
}
```

## 🔧 Como Documentar Corretamente

### Controller de Autenticação
```typescript
@ApiResponse({ 
  status: 200, 
  description: "Autenticação realizada com sucesso",
  schema: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: { 
        type: "string", 
        description: "JWT token",
        example: "eyJhbGciOiJIUzI1NiIs..." 
      }
    },
    required: ["success", "data"]
  }
})
async auth(@Body() body: AuthenticateUser): Promise<string> {
  return await this.service.run(body); // Service retorna string
}
```

### Controller de Dados Complexos
```typescript
@ApiResponse({ 
  status: 200, 
  description: "Dados do usuário",
  schema: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" }
        }
      }
    },
    required: ["success", "data"]
  }
})
async getUser(): Promise<UserResponseDTO> {
  return await this.service.run(id); // Service retorna UserResponseDTO
}
```

## ✅ Controllers Implementados Corretamente

- **LoginController** - Service retorna `string` (JWT), interceptor envolve em `{ success: true, data: string }`
- **RegisterController** - Service retorna `string` (UUID), interceptor envolve em `{ success: true, data: string }`
- **RefreshTokenController** - Service retorna `string` (JWT), interceptor envolve em `{ success: true, data: string }`
- **GetUserDataController** - Service retorna `UserResponseDTO`, interceptor envolve em `{ success: true, data: UserResponseDTO }`

## 🎯 Princípios

1. **Controllers retornam exatamente o que os Services retornam**
2. **OpenAPI especifica a resposta final (após interceptor)**
3. **Erros são sempre exceptions, nunca objetos de retorno**
4. **Sem DTOs customizados de resposta - use os tipos dos Services**
     ↓
Cliente recebe: { success: true, data: "token-jwt" }
```

### Erro (4xx/5xx)
```
Service executa: this.repository.errors.badRequest()
     ↓
Exception é lançada: BadRequestError
     ↓
Exception filter processa: { message: "Bad request", statusCode: 400, timestamp: "...", path: "..." }
     ↓
Cliente recebe: { message: "Bad request", statusCode: 400, ... }
```

## 📦 Estrutura Corrigida

### Padrões de Resposta Reais

#### Sucesso (sempre via interceptor)
```typescript
{
  success: true,
  data: /* dados do service */
}
```

#### Erro (sempre via exception filter)
```typescript
{
  message: "Mensagem de erro",
  statusCode: 400,
  timestamp: "2024-01-15T10:30:00Z",
  path: "/api/endpoint"
}
```

## 🔧 Como Usar Corretamente

### Controller de Autenticação
```typescript
@ApiResponse({ 
  status: 200, 
  description: "Autenticação realizada com sucesso",
  schema: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: { 
        type: "string", 
        description: "JWT token",
        example: "eyJhbGciOiJIUzI1NiIs..." 
      }
    },
    required: ["success", "data"]
  }
})
async auth(@Body() body: AuthenticateUser): Promise<string> {
  // Service retorna string, interceptor adiciona { success: true, data: string }
  return await this.service.run(body);
}
```

### Controller de Usuário
```typescript
@ApiResponse({ 
  status: 200, 
  description: "Dados do usuário",
  schema: {
    type: "object",
    properties: {
      success: { type: "boolean", example: true },
      data: {
        type: "object",
        properties: {
          id: { type: "string", format: "uuid" },
          name: { type: "string" },
          email: { type: "string", format: "email" },
          // ... outros campos do UserResponseDTO
        }
      }
    },
    required: ["success", "data"]
  }
})
async getUser(): Promise<UserResponseDTO> {
  // Service retorna UserResponseDTO, interceptor adiciona { success: true, data: UserResponseDTO }
  return await this.service.run(id);
}
```

## ✅ Controllers Corrigidos

- `LoginController` - Retorna JWT string, interceptor envolve em `{ success: true, data: string }`
- `RegisterController` - Retorna UUID string, interceptor envolve em `{ success: true, data: string }`
- `GetUserDataController` - Retorna `UserResponseDTO`, interceptor envolve em `{ success: true, data: UserResponseDTO }`

## � Erros Anteriores

- ❌ Assumir que controllers retornam objetos customizados como `{ token: string }`
- ❌ Não considerar o interceptor `StandardizeResponse`
- ❌ Especificar status 401 para credenciais inválidas (service lança BadRequest)
- ❌ Criar DTOs de resposta desnecessários

## ✅ Implementação Correta

- ✅ Controllers retornam tipos exatos dos services
- ✅ OpenAPI especifica resposta do interceptor `{ success: true, data: ... }`
- ✅ Erros seguem padrão do exception filter
- ✅ Status codes corretos baseados no comportamento real

## 🛠️ Utilitários Atualizados

```typescript
// Para respostas de sucesso (com interceptor)
createStandardizedSuccessResponse(dataSchema)

// Para dados primitivos
createPrimitiveDataSchema("string", "uuid", "550e8400-...")

// Para objetos complexos  
createObjectDataSchema(properties, required)

// Para erros (exception filter)
createErrorResponseSchema(message, statusCode)
```

Esta abordagem garante que a documentação OpenAPI reflita exatamente o comportamento do sistema em produção.
