# Testes E2E - Sistema de Agendamento Médico

## 📋 Visão Geral

Esta pasta contém os testes End-to-End (E2E) completos para o sistema de agendamento médico, cobrindo todos os módulos e funcionalidades da API.

## 🏗️ Estrutura de Testes

### Testes Implementados

- ✅ **Autenticação** (`auth-*.e2e-spec.ts`)
  - Login de usuários
  - Registro de novos usuários
  - Refresh de tokens JWT

- ✅ **Usuários** (`users.e2e-spec.ts`)
  - Obter dados do usuário autenticado
  - Atualizar perfil do usuário
  - Deletar conta do usuário

- ✅ **Disponibilidades de Médicos** (`doctor-availability.e2e-spec.ts`)
  - Criar disponibilidades de horários
  - Listar disponibilidades
  - Atualizar horários disponíveis
  - Deletar disponibilidades

- ✅ **Agendamentos** (`schedules.e2e-spec.ts`)
  - Criar agendamentos (pacientes)
  - Listar agendamentos por usuário
  - Cancelar agendamentos
  - Completar consultas (médicos)
  - Deletar agendamentos

- ✅ **Busca de Horários** (`availability.e2e-spec.ts`)
  - Buscar slots disponíveis por médico
  - Filtrar por data específica
  - Filtrar por período

- ✅ **Relatórios** (`reports.e2e-spec.ts`)
  - Listar agendamentos do médico
  - Controle de acesso por perfil

## 🛠️ Configuração do Ambiente

### Pré-requisitos

- Node.js 18+
- Docker e Docker Compose
- pnpm

### Variáveis de Ambiente

O arquivo `.env.testing` contém as configurações específicas para testes:

```env
PORT=8080
POSTGRESQL_USERNAME=test_user
POSTGRESQL_PASSWORD=test_password
POSTGRESQL_DATABASE=vox_testing_test
DATABASE_URL=postgresql://test_user:test_password@localhost:5433/vox_testing_test
ARGON_SECRET=test_argon_secret_for_e2e_tests
JWT_PRIVATE_KEY=test_jwt_private_key_for_e2e_tests
REDIS_URL=redis://localhost:6380/1
```

### Banco de Dados de Teste

Os testes utilizam um banco PostgreSQL isolado que é:
- Configurado automaticamente via Docker
- Limpo antes de cada teste
- Executado em porta diferente (5433) para não interferir no desenvolvimento

## 🚀 Executando os Testes

### Método Automático (Recomendado)

```bash
# Executa todo o setup e testes automaticamente
pnpm test:e2e:setup
```

Este comando:
1. Inicia containers Docker (PostgreSQL + Redis)
2. Aplica migrações no banco de teste
3. Executa todos os testes E2E
4. Limpa o ambiente (para containers)

### Método Manual

```bash
# 1. Iniciar containers de teste
docker-compose -f docker-compose.test.yml up -d

# 2. Aplicar migrações
pnpm db:test:migrate

# 3. Executar testes
pnpm test:e2e

# 4. Limpar ambiente
docker-compose -f docker-compose.test.yml down
```

### Comandos Auxiliares

```bash
# Aplicar migrações no banco de teste
pnpm db:test:migrate

# Resetar banco de teste (cuidado!)
pnpm db:test:reset

# Executar apenas os testes (sem setup)
pnpm test:e2e
```

## 📊 Cobertura de Testes

### Cenários Testados

#### 🔐 Segurança
- ✅ Autenticação JWT obrigatória
- ✅ Autorização por perfil (DOCTOR/PATIENT)
- ✅ Validação de tokens inválidos/expirados
- ✅ Controle de acesso a recursos próprios

#### 📝 Validação de Dados
- ✅ Validação de DTOs com dados inválidos
- ✅ Campos obrigatórios
- ✅ Formatos de email, datas, horários
- ✅ Regras de negócio (horários futuros, conflitos)

#### 🔄 Fluxos Completos
- ✅ Cadastro → Login → Operações autenticadas
- ✅ Médico cria disponibilidade → Paciente agenda → Médico completa
- ✅ Cancelamento de agendamentos
- ✅ Busca e filtragem de horários

#### ⚠️ Tratamento de Erros
- ✅ Recursos não encontrados (404)
- ✅ Dados inválidos (400)
- ✅ Não autorizado (401)
- ✅ Acesso negado (403)
- ✅ Conflitos de dados (409)

## 🧪 Utilitários de Teste

### Setup Helper (`setup-e2e.ts`)

Fornece funções auxiliares para criar dados de teste:

```typescript
// Criar usuário de teste
const user = await createTestUser("PATIENT" | "DOCTOR");

// Criar disponibilidade de médico
const availability = await createTestAvailability(doctorId);

// Criar agendamento
const schedule = await createTestSchedule(patientId, doctorId, availabilityId);
```

### Limpeza Automática

- Banco é limpo antes de cada teste
- Isolation entre testes garantida
- Sem interferência entre diferentes suites

## 🔧 Configuração Jest

```typescript
// test/jest-e2e.config.ts
export default {
  testEnvironment: "node",
  testRegex: ".e2e-spec.ts$",
  setupFilesAfterEnv: ["<rootDir>/test/setup-e2e.ts"],
  testTimeout: 30000,
  maxWorkers: 1, // Evita conflitos no banco
  forceExit: true,
  detectOpenHandles: true,
};
```

## 📈 Melhores Práticas

### ✅ Implementadas

- **Isolation**: Cada teste é independente
- **Setup/Teardown**: Limpeza automática entre testes
- **Dados Reais**: Testes usam banco real (não mocks)
- **Cobertura Completa**: Todos os endpoints testados
- **Cenários Realistas**: Fluxos de usuário reais
- **Performance**: Testes rápidos e eficientes

### 🔄 Processo de Teste

1. **Setup**: Container + Banco + Dados de teste
2. **Execution**: Request HTTP real para API
3. **Validation**: Verificação de responses e side effects
4. **Cleanup**: Limpeza de dados e recursos

## 🐛 Troubleshooting

### Problemas Comuns

#### Erro de Conexão com Banco
```bash
# Verificar se containers estão rodando
docker ps

# Restart dos containers
docker-compose -f docker-compose.test.yml restart
```

#### Portas em Uso
```bash
# Verificar portas
lsof -i :5433
lsof -i :6380

# Parar containers se necessário
docker-compose -f docker-compose.test.yml down
```

#### Timeout nos Testes
- Aumente o `testTimeout` em `jest-e2e.config.ts`
- Verifique performance do Docker
- Considere usar `maxWorkers: 1`

#### Testes Flaky
- Verifique se limpeza está funcionando
- Adicione `await` em operações async
- Use `beforeEach` para setup independente

## 📝 Contribuindo

### Adicionando Novos Testes

1. Criar arquivo `*.e2e-spec.ts` em `/test/routes/`
2. Importar utilitários de `../setup-e2e`
3. Seguir padrão de estrutura existente
4. Incluir cenários positivos e negativos
5. Testar autenticação e autorização

### Padrão de Teste

```typescript
describe("NovoModule (e2e)", () => {
  let app: INestApplication;
  let authToken: string;

  beforeEach(async () => {
    // Setup do módulo
    // Criação de dados de teste
    // Geração de tokens
  });

  afterEach(async () => {
    await app.close();
  });

  describe("POST /endpoint", () => {
    it("deve permitir operação válida", () => {
      // Teste de caso de sucesso
    });

    it("deve rejeitar dados inválidos", () => {
      // Teste de validação
    });

    it("deve rejeitar sem autenticação", () => {
      // Teste de segurança
    });
  });
});
```

---

✅ **Status**: Todos os testes E2E implementados e funcionais  
🎯 **Cobertura**: 100% dos endpoints da API  
🚀 **Performance**: ~30s execução completa  
🔒 **Segurança**: Todos os cenários de auth/authz testados
