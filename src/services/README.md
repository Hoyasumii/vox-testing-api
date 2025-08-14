# Testes Unitários dos Serviços

Este diretório contém os testes unitários para todos os serviços da aplicação, implementados com injeção de dependência usando o `UsersRepository` de teste.

## Estrutura dos Testes

### HelloWorldService
- **Arquivo**: `src/services/__tests__/hello-world.service.spec.ts`
- **Testes**: 3 testes
- **Cobertura**:
  - Retorno da mensagem "Hello World!"
  - Consistência do retorno
  - Validação do tipo de retorno

### Serviços de Usuário
Localização: `src/services/users/__tests__/`

#### CreateUserService
- **Testes**: 6 testes
- **Cobertura**:
  - Criação de usuário com sucesso
  - Hash da senha antes de salvar
  - Tipo PATIENT por padrão
  - Validação de dados inválidos
  - Criação de múltiplos usuários
  - Criação de usuário DOCTOR

#### GetUserContentByIdService
- **Testes**: 6 testes
- **Cobertura**:
  - Busca de usuário existente por ID
  - Exclusão da senha do resultado
  - Validação de ID inválido
  - Tratamento de usuário não encontrado
  - Busca de usuário DOCTOR
  - Validação de tipos de dados

#### UpdateUserService
- **Testes**: 8 testes
- **Cobertura**:
  - Atualização completa de usuário
  - Atualização parcial (apenas campos fornecidos)
  - Validação de ID inválido
  - Validação de dados inválidos
  - Tratamento de usuário inexistente
  - Atualização de email
  - Atualização de tipo de usuário
  - Atualização de múltiplos campos

#### DeleteUserService
- **Testes**: 7 testes
- **Cobertura**:
  - Deleção de usuário existente
  - Tratamento de usuário inexistente
  - Validação de ID inválido
  - Deleção seletiva (apenas usuário especificado)
  - Deleção de usuário DOCTOR
  - Deleção de usuário PATIENT
  - Validação do tipo de retorno

#### GetAuthContentByEmailService
- **Testes**: 8 testes
- **Cobertura**:
  - Busca de dados de autenticação por email
  - Retorno apenas de id e password
  - Validação de email inválido
  - Tratamento de email não encontrado
  - Funcionamento com usuário DOCTOR
  - Funcionamento com usuário PATIENT
  - Case sensitivity do email
  - Diferenciação de usuários

## Injeção de Dependência

Todos os testes utilizam o padrão de injeção de dependência:

```typescript
let service: ServiceClass;
let repository: UsersRepository;

beforeEach(() => {
    repository = new UsersRepository();
    service = new ServiceClass(repository);
});

afterEach(() => {
    repository.clear();
});
```

## Repository de Teste

Os testes utilizam o `UsersRepository` localizado em `test/repositories/users.repository.ts`, que implementa:
- Armazenamento em memória
- Geração de UUIDs válidos
- Implementação completa da `UsersRepositoryBase`
- Métodos auxiliares para testes (`clear()`, `count()`, `findAll()`)

## Estatísticas

- **Total de testes de serviços**: 38
- **Taxa de sucesso**: 100%
- **Cobertura**: Todos os métodos principais e casos de erro
- **Padrões testados**: 
  - Casos de sucesso
  - Validação de entrada
  - Tratamento de erro
  - Edge cases
  - Tipos de retorno

## Execução dos Testes

```bash
# Todos os testes de serviços
pnpm test src/services/

# Teste específico do HelloWorld
pnpm test src/services/__tests__/hello-world.service.spec.ts

# Todos os testes de serviços de usuário
pnpm test src/services/users/__tests__/

# Teste específico de um serviço
pnpm test src/services/users/__tests__/create-user.service.spec.ts
```
