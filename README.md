# API - Sistema de Agendamento Médico

Sistema backend para agendamento médico desenvolvido com NestJS, onde médicos podem disponibilizar seus horários e pacientes podem realizar agendamentos.

## � Decisão Tecnológica: Por que NestJS ao invés de .NET ou Java?
Eu acabei me aperfeiçoando bastante na stack de Node.js com TypeScript e o ecossistema em si. Entretanto, há cerca de um ano, eu venho amadurecendo muito a forma de como eu vejo para se criar um projeto, e tenho muito interesse em poder ingressar para uma outra linguagem, só não tive oportunidade.

Além do mais, quando um projeto se inicia com a modelagem do sistema em si e o design do código, a linguagem acaba não fazendo muita diferença, pois a linguagem ubíqua prevalece e acaba se criando um único idioma. Não sei se faz sentido, mas quando o projeto acaba tendo a necessidade de ser robusto e ele é construído nesse intuito, as barreiras entre frameworks e linguagens se tornam quase que nulas.

#### ✅ **Escolhas Feitas**
- **NestJS vs Express**: Estrutura + DI + Decorators
- **Prisma vs TypeORM**: Developer experience + type safety
- **Zod vs class-validator**: Runtime safety + schema reuse
- **Redis vs In-memory**: Distributed caching + persistence
- **JWT vs Sessions**: Stateless + microservices ready

#### ⚖️ **Trade-offs Considerados**
- **Performance vs Maintainability**: Optamos por código limpo
- **Flexibility vs Convention**: NestJS opinions aceitas
- **Simplicity vs Features**: Features essenciais implementadas
- **Memory vs Speed**: Cache estratégico implementado

## 🎨 Decisões de Design de Código

### Organização de Módulos

```
src/
├── modules/                    # Módulos de domínio
│   ├── auth/                  # Autenticação isolada
│   ├── users/                 # Gestão de usuários
│   ├── doctors/               # Domínio médicos
│   ├── schedules/             # Domínio agendamentos
│   └── availability/          # Domínio disponibilidade
├── shared/                    # Código compartilhado
│   ├── guards/               # Guards reutilizáveis
│   ├── interceptors/         # Interceptors globais
│   ├── decorators/           # Decorators customizados
│   └── pipes/                # Pipes de validação
└── common/                   # Utilitários comuns
    ├── dtos/                 # DTOs base
    ├── errors/               # Hierarquia de erros
    └── types/                # Tipos compartilhados
```

### Convenções de Nomenclatura

#### 1. **Arquivos e Classes**
```typescript
// Controllers: PascalCase + .controller.ts
export class ScheduleController {}

// Services: PascalCase + .service.ts  
export class ScheduleService {}

// DTOs: PascalCase + .dto.ts
export class CreateScheduleDto {}

// Entities: PascalCase (Prisma models)
export interface Schedule {}
```

#### 2. **Métodos e Variáveis**
```typescript
// Métodos: camelCase + verbo descritivo
async createSchedule(data: CreateScheduleDto) {}
async findAvailableSlots(filters: AvailabilityFilters) {}
async cancelScheduleById(id: string) {}

// Variáveis: camelCase + substantivo descritivo
const availableSlots = await this.findSlots();
const doctorSchedules = await this.repository.findByDoctor();
```

#### 3. **Constantes e Enums**
```typescript
// Constantes: SCREAMING_SNAKE_CASE
export const DEFAULT_PAGINATION_LIMIT = 20;
export const CACHE_TTL_MINUTES = 30;

// Enums: PascalCase
export enum ScheduleStatus {
  SCHEDULED = 'SCHEDULED',
  CANCELED = 'CANCELED',
  COMPLETED = 'COMPLETED'
}
```

### Padrões de Implementação

#### 1. **Error Handling Strategy**
```typescript
// Hierarquia de erros customizada
abstract class ApplicationError extends Error {
  abstract statusCode: number;
  abstract errorCode: string;
}

class ConflictError extends ApplicationError {
  statusCode = 409;
  errorCode = 'CONFLICT';
}

// Uso consistente em services
async createSchedule(data: CreateScheduleDto) {
  const hasConflict = await this.checkTimeConflict(data);
  
  if (hasConflict) {
    throw new ConflictError('Schedule time conflict detected');
  }
}
```

#### 2. **Response Standardization**
```typescript
// DTOs de resposta padronizados
export class ScheduleResponseDto {
  @ApiProperty() id: string;
  @ApiProperty() doctorId: string;
  @ApiProperty() patientId: string;
  @ApiProperty() dateTime: string;
  @ApiProperty() status: ScheduleStatus;
  @ApiProperty() createdAt: string;
  @ApiProperty() updatedAt: string;
}

// Paginação consistente
export class PaginatedResponseDto<T> {
  @ApiProperty() data: T[];
  @ApiProperty() pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}
```

#### 3. **Validation Patterns**
```typescript
// Schemas Zod reutilizáveis
export const UUIDSchema = z.string().uuid();
export const DateTimeSchema = z.string().datetime();
export const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  limit: z.number().min(1).max(100).default(20)
});

// Composição de schemas
export const CreateScheduleSchema = z.object({
  doctorId: UUIDSchema,
  dateTime: DateTimeSchema,
  patientNotes: z.string().optional()
});
```

### Design de API REST

#### 1. **RESTful Design Principles**
```typescript
// Recursos bem definidos
/auth                          # Autenticação
/users                         # Usuários genéricos
/doctors                       # Recurso médicos
/doctors/:id/availability      # Sub-recurso aninhado
/schedules                     # Agendamentos
/availability/slots            # Endpoint de busca especializado
```

#### 2. **HTTP Status Codes**
```typescript
// Uso semântico correto
200 OK          // Sucesso em GET, PUT
201 Created     // Sucesso em POST
204 No Content  // Sucesso em DELETE
400 Bad Request // Validation errors
401 Unauthorized// Token inválido/ausente
403 Forbidden   // Sem permissão
404 Not Found   // Recurso não encontrado
409 Conflict    // Conflito de agendamento
429 Too Many    // Rate limit exceeded
500 Internal    // Erro interno
```

#### 3. **Content Negotiation**
```typescript
// Headers padronizados
@Header('Content-Type', 'application/json')
@ApiProduces('application/json')
@ApiConsumes('application/json')

// Versionamento preparado
@Controller({ path: 'schedules', version: '1' })
```

### Database Design Patterns

#### 1. **Prisma Schema Organization**
```prisma
// Enums centralizados
enum UserType { DOCTOR PATIENT }
enum ScheduleStatus { SCHEDULED CANCELED COMPLETED }

// Models com relacionamentos claros
model User {
  id        String   @id @default(uuid())
  type      UserType @default(PATIENT)
  
  // Relacionamentos
  doctorProfile    Doctor?
  patientSchedules Schedule[] @relation("PatientSchedules")
  
  // Timestamps
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")
}
```

#### 2. **Migration Strategy**
```sql
-- Naming: timestamp_description_of_change
-- Example: 20250814124402_initial_migration

-- Índices para performance
CREATE INDEX idx_doctor_availability_datetime 
ON "DoctorAvailability"(doctor_id, start_time, end_time);

CREATE INDEX idx_schedule_status_datetime 
ON "Schedule"(status, date_time);
```

### Testing Design Patterns

#### 1. **Test Organization**
```typescript
// Describe blocks estruturados
describe('ScheduleService', () => {
  describe('createSchedule', () => {
    it('should create schedule successfully', async () => {});
    it('should throw conflict error for overlapping times', async () => {});
    it('should validate doctor availability', async () => {});
  });
  
  describe('cancelSchedule', () => {
    it('should cancel own schedule as patient', async () => {});
    it('should cancel any schedule as doctor', async () => {});
    it('should throw forbidden for unauthorized cancel', async () => {});
  });
});
```

#### 2. **Mock Patterns**
```typescript
// Factory functions para testes
export const createMockUser = (overrides?: Partial<User>): User => ({
  id: 'uuid-mock',
  email: 'test@example.com',
  type: UserType.PATIENT,
  ...overrides
});

// Repository mocks consistentes
const mockScheduleRepository = {
  create: jest.fn(),
  findById: jest.fn(),
  findByDoctor: jest.fn()
};
```

### Performance Design Patterns

#### 1. **Lazy Loading Strategy**
```typescript
// Eager loading apenas quando necessário
const scheduleWithRelations = await prisma.schedule.findUnique({
  where: { id },
  include: {
    doctor: { select: { id: true, user: { select: { name: true } } } },
    patient: { select: { id: true, user: { select: { name: true } } } }
  }
});

// Lazy loading para listas
const schedules = await prisma.schedule.findMany({
  select: { id: true, dateTime: true, status: true } // Apenas campos necessários
});
```

#### 2. **Batch Operations**
```typescript
// Operações em lote quando possível
async createMultipleAvailabilities(slots: CreateAvailabilityDto[]) {
  return this.prisma.doctorAvailability.createMany({
    data: slots,
    skipDuplicates: true
  });
}
```

### Security Design Patterns

#### 1. **Input Sanitization**
```typescript
// Sanitização automática nos DTOs
export const CreateScheduleSchema = z.object({
  doctorId: z.string().uuid(), // UUID validation
  dateTime: z.string().datetime().refine(
    (date) => new Date(date) > new Date(), // Future date only
    { message: 'DateTime must be in the future' }
  ),
  notes: z.string().max(500).optional() // Length limit
});
```

#### 2. **Authorization Patterns**
```typescript
// Guards compostos para autorização granular
@UseGuards(JwtAuthGuard, ResourceOwnerGuard)
async getMySchedules(@CurrentUser() user: User) {
  // Usuário só acessa próprios agendamentos
}

@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.DOCTOR)
async completeSchedule(@Param('id') id: string) {
  // Apenas médicos podem completar agendamentos
}
```

## 🚀 Tecnologias Utilizadaso Desenvolvedor]**  
> *[Espaço reservado para explicar a escolha do NestJS ao invés de .NET, considerando fatores como experiência, ecosystem, performance, produtividade, etc.]*

## 🏛️ Decisões de Arquitetura e Design

### Arquitetura Geral

Este projeto segue uma **arquitetura em camadas** inspirada em princípios de **Clean Architecture** e **Domain-Driven Design (DDD)**, adaptada para o contexto do NestJS:

```
┌─────────────────────────────────────────────────────────────┐
│                    📡 CONTROLLERS LAYER                    │
│  • Rotas REST API                                          │
│  • Validação de entrada (DTOs + Zod)                       │
│  • Documentação OpenAPI/Swagger                            │
│  • Rate Limiting & Guards                                  │
└─────────────────────────────────────────────────────────────┘
                                ⬇️
┌─────────────────────────────────────────────────────────────┐
│                     🧠 SERVICES LAYER                      │
│  • Lógica de negócio                                       │
│  • Regras de domínio                                       │
│  • Orquestração entre repositórios                         │
│  • Sistema de mensageria (PUB/SUB)                         │
└─────────────────────────────────────────────────────────────┘
                                ⬇️
┌─────────────────────────────────────────────────────────────┐
│                  💾 REPOSITORIES LAYER                     │
│  • Abstração de dados                                      │
│  • Cache integrado (Redis)                                 │
│  • Padrão Repository                                       │
│  • Event-driven updates                                    │
└─────────────────────────────────────────────────────────────┘
                                ⬇️
┌─────────────────────────────────────────────────────────────┐
│                   🗄️ DATABASE LAYER                        │
│  • PostgreSQL (Prisma ORM)                                 │
│  • Migrations & Schema management                          │
│  • Performance otimizado com índices                       │
└─────────────────────────────────────────────────────────────┘
```

### Principais Decisões Arquiteturais

#### 1. **Separation of Concerns (SoC)**
- **Controllers**: Apenas responsáveis por receber requisições e retornar respostas
- **Services**: Contêm toda a lógica de negócio e regras de domínio
- **Repositories**: Abstraem o acesso aos dados com cache integrado
- **DTOs**: Validação e transformação de dados de entrada/saída

#### 2. **Repository Pattern + Cache**
```typescript
// Exemplo da implementação
abstract class CacheableRepository<T> {
  // Cache automático em operações de leitura
  // Invalidação inteligente em operações de escrita
  // PUB/SUB para sincronização entre instâncias
}
```

**Benefícios:**
- **Performance**: Cache Redis transparente
- **Escalabilidade**: Invalidação distribuída via PUB/SUB
- **Testabilidade**: Repositórios mockáveis
- **Manutenibilidade**: Mudanças de ORM isoladas

#### 3. **Event-Driven Architecture (Messaging)**
```typescript
// Sistema de eventos para desacoplamento
@Injectable()
export class ScheduleService {
  async createSchedule(data: CreateScheduleDto) {
    const schedule = await this.repository.create(data);
    
    // Evento disparado automaticamente
    this.eventBus.publish('schedule.created', schedule);
    return schedule;
  }
}
```

**Vantagens:**
- **Desacoplamento**: Serviços não dependem uns dos outros
- **Extensibilidade**: Novos listeners sem modificar código existente
- **Auditoria**: Rastreamento de eventos de negócio
- **Integrações futuras**: Facilita adição de notificações, emails, etc.

#### 4. **Type-Safe Validation com Zod**
```typescript
// DTOs tipados e validados
export const CreateScheduleSchema = z.object({
  doctorId: z.string().uuid(),
  dateTime: z.string().datetime(),
  patientNotes: z.string().optional()
});

export const CreateScheduleDto = createZodDto(CreateScheduleSchema);
```

**Benefícios:**
- **Segurança**: Validação em runtime
- **DX**: IntelliSense completo
- **Documentação**: Schema automático no Swagger
- **Manutenibilidade**: Mudanças propagadas automaticamente

### Design Patterns Implementados

#### 1. **Dependency Injection (DI)**
- Container IoC nativo do NestJS
- Facilita testes e mocking
- Baixo acoplamento entre componentes

#### 2. **Factory Pattern**
```typescript
// Factories para criação de objetos complexos
@Injectable()
export class ScheduleFactory {
  createFromAvailability(availability: DoctorAvailability, patientId: string) {
    // Lógica complexa de criação encapsulada
  }
}
```

#### 3. **Guard Pattern**
```typescript
// Proteção de rotas com guards customizados
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserType.DOCTOR)
export class DoctorController {
  // Apenas médicos podem acessar
}
```

#### 4. **Decorator Pattern**
```typescript
// Decorators customizados para funcionalidades cross-cutting
@RateLimit({ requests: 5, windowMs: 60000 })
@ApiTags('Authentication')
@Controller('auth')
export class AuthController {}
```

### Estratégias de Performance

#### 1. **Multi-Level Caching**
```typescript
// Cache em múltiplas camadas
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│ Application │ -> │    Redis    │ -> │ PostgreSQL  │
│   Memory    │    │   (L2)      │    │   (Source)  │
│   (L1)      │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘
```

#### 2. **Database Optimization**
- **Índices estratégicos**: Queries otimizadas para busca de disponibilidade
- **Connection pooling**: Prisma com pool configurado
- **Query optimization**: Eager/lazy loading conforme necessário

#### 3. **Rate Limiting Inteligente**
```typescript
// Rate limits diferenciados por contexto
const authLimits = { ttl: 60, limit: 5 };      // Login
const scheduleLimits = { ttl: 60, limit: 20 }; // Agendamentos
const searchLimits = { ttl: 60, limit: 100 };  // Busca
```

### Segurança por Design

#### 1. **Defense in Depth**
```
┌─────────────────────────────────────────────────────────────┐
│ 🛡️ SECURITY LAYERS                                         │
├─────────────────────────────────────────────────────────────┤
│ 1. Rate Limiting (DDoS protection)                         │
│ 2. Input Validation (Zod schemas)                          │
│ 3. Authentication (JWT tokens)                             │
│ 4. Authorization (Role-based access)                       │
│ 5. Data Sanitization (SQL injection prevention)           │
│ 6. Audit Logging (Event tracking)                          │
└─────────────────────────────────────────────────────────────┘
```

#### 2. **Principle of Least Privilege**
- **Role-based access**: DOCTOR vs PATIENT permissions
- **Resource ownership**: Usuários só acessam seus próprios dados
- **Route protection**: Guards em todas as rotas sensíveis

### Estratégias de Escalabilidade

#### 1. **Horizontal Scaling Ready**
```typescript
// Stateless design + Redis para sessões
// PUB/SUB para sincronização entre instâncias
// Load balancer friendly
```

#### 2. **Database Scaling**
- **Read replicas**: Queries de leitura distribuídas
- **Sharding friendly**: UUIDs como primary keys
- **Async processing**: Events para operações pesadas

#### 3. **Microservices Ready**
```typescript
// Arquitetura preparada para decomposição:
// - Auth Service
// - Doctor Service  
// - Schedule Service
// - Notification Service
```

### Qualidade e Manutenibilidade

#### 1. **Testing Strategy**
```
├── Unit Tests (Jest)
│   ├── Services (business logic)
│   ├── Repositories (data access)
│   └── Utilities (pure functions)
├── Integration Tests
│   ├── API endpoints (e2e)
│   ├── Database operations
│   └── Cache behavior
└── Contract Tests
    ├── DTO validation
    └── API schemas
```

#### 2. **Code Quality**
- **Biome**: Linting e formatação consistente
- **TypeScript**: Type safety em toda a aplicação
- **Conventional commits**: Histórico organizado
- **Documentation**: Swagger automático + comentários

#### 3. **Monitoring & Observability**
```typescript
// Preparado para:
// - Metrics (Prometheus)
// - Logging (structured logs)
// - Tracing (distributed tracing)
// - Health checks (k8s ready)
```

### Decisões de Trade-offs

#### ✅ **Escolhas Feitas**
- **NestJS vs Express**: Estrutura + DI + Decorators
- **Prisma vs TypeORM**: Developer experience + type safety
- **Zod vs class-validator**: Runtime safety + schema reuse
- **Redis vs In-memory**: Distributed caching + persistence
- **JWT vs Sessions**: Stateless + microservices ready

#### ⚖️ **Trade-offs Considerados**
- **Performance vs Maintainability**: Optamos por código limpo
- **Flexibility vs Convention**: NestJS opinions aceitas
- **Simplicity vs Features**: Features essenciais implementadas
- **Memory vs Speed**: Cache estratégico implementado

## �🚀 Tecnologias Utilizadas

- **Backend**: NestJS (Node.js + TypeScript)
- **Banco de Dados**: PostgreSQL
- **Cache**: Redis
- **ORM**: Prisma
- **Autenticação**: JWT + Argon2
- **Validação**: Zod
- **Documentação**: OpenAPI/Swagger
- **Testes**: Jest
- **Code Quality**: Biome (linting + formatting)
- **Rate Limiting**: NestJS Throttler

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- [Node.js](https://nodejs.org/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/) (versão 8 ou superior)
- [Docker](https://www.docker.com/) e [Docker Compose](https://docs.docker.com/compose/)
- [Git](https://git-scm.com/)

## 🛠️ Configuração do Ambiente

### 1. Clone o repositório

```bash
git clone <url-do-repositorio>
cd vox-testing/api
```

### 2. Configure as variáveis de ambiente

Crie um arquivo `.env` na raiz do projeto baseado no exemplo:

```bash
cp .env.testing .env
```

Edite o arquivo `.env` com suas configurações:

```env
# Porta da aplicação
PORT=3000

# Configurações do PostgreSQL
POSTGRESQL_USERNAME=vox_user
POSTGRESQL_PASSWORD=vox_password
POSTGRESQL_DATABASE=vox_testing
DATABASE_URL=postgresql://vox_user:vox_password@localhost:5432/vox_testing

# Segurança
ARGON_SECRET=your_super_secret_argon_key_here
JWT_PRIVATE_KEY=your_super_secret_jwt_private_key_here

# Redis
REDIS_URL=redis://localhost:6379/0
```

### 3. Instale as dependências

```bash
pnpm install
```

## 🐳 Execução com Docker (Recomendado)

### Opção 1: Docker Compose Completo

Para subir toda a infraestrutura (PostgreSQL + Redis) de uma só vez:

```bash
# Inicia os serviços de banco e cache
docker-compose up -d

# Aguarde alguns segundos para os containers inicializarem
sleep 10

# Execute as migrações do banco
npx prisma migrate deploy

# Inicie a aplicação
pnpm run start:dev
```

### Opção 2: Apenas Infraestrutura

Se preferir rodar apenas o banco e cache no Docker:

```bash
# Inicia apenas PostgreSQL e Redis
docker-compose up -d vox-testing-db vox-testing-redis

# Execute o resto dos comandos normalmente
npx prisma migrate deploy
pnpm run start:dev
```

## 🗄️ Configuração do Banco de Dados

### Executar migrações

```bash
# Aplicar migrações existentes
npx prisma migrate deploy

# Ou para desenvolvimento (cria nova migração se necessário)
npx prisma migrate dev
```

### Gerar cliente Prisma

```bash
npx prisma generate
```

### Visualizar dados (Prisma Studio)

```bash
npx prisma studio
```

## 🏃‍♂️ Executando a Aplicação

### Desenvolvimento

```bash
# Modo desenvolvimento com hot reload
pnpm run start:dev

# Modo debug
pnpm run start:debug
```

### Produção

```bash
# Build da aplicação
pnpm run build

# Execução em produção
pnpm run start:prod
```

A API estará disponível em: `http://localhost:3000`

## 📚 Documentação da API

Após iniciar a aplicação, acesse:

- **Swagger UI**: `http://localhost:3000/api`
- **Scalar (alternativa)**: `http://localhost:3000/scalar`

## 🧪 Testes

### Testes Unitários

```bash
# Executar todos os testes
pnpm run test

# Executar em modo watch
pnpm run test:watch

# Executar com coverage
pnpm run test:coverage
```

### Testes E2E

```bash
# Setup completo dos testes E2E
pnpm run test:e2e:setup

# Ou execute manualmente:
docker-compose -f docker-compose.test.yml up -d
pnpm run db:test:migrate
pnpm run test:e2e
```

## 🔧 Scripts Disponíveis

```bash
# Desenvolvimento
pnpm run start:dev          # Inicia em modo desenvolvimento
pnpm run start:debug        # Inicia em modo debug

# Build e produção
pnpm run build              # Build da aplicação
pnpm run start:prod         # Execução em produção

# Qualidade de código
pnpm run lint               # Executar linting e formatação

# Testes
pnpm run test               # Testes unitários
pnpm run test:watch         # Testes em modo watch
pnpm run test:coverage      # Testes com coverage
pnpm run test:e2e           # Testes E2E

# Banco de dados
pnpm run db:test:migrate    # Migração banco de teste
pnpm run db:test:reset      # Reset banco de teste
```

## 🏗️ Estrutura do Projeto

```
src/
├── app.module.ts           # Módulo principal
├── main.ts                 # Entry point da aplicação
├── controllers/            # Controladores REST
├── services/               # Lógica de negócio
├── repositories/           # Camada de dados
├── dtos/                   # Data Transfer Objects
├── guards/                 # Guards de autenticação/autorização
├── interceptors/           # Interceptadores
├── errors/                 # Classes de erro customizadas
├── modules/                # Módulos da aplicação
├── utils/                  # Utilitários
└── cache/                  # Implementação de cache
```

## 🔐 Funcionalidades de Segurança

- **Autenticação JWT**: Tokens seguros para autenticação
- **Hash de senhas**: Argon2 para hash seguro das senhas
- **Rate Limiting**: Proteção contra spam/DoS
- **Validação de dados**: Zod para validação robusta
- **Controle de acesso**: Guards para médicos e pacientes

## 🚀 Funcionalidades Principais

### Para Médicos
- Cadastro e login
- Gerenciamento de disponibilidade de horários
- Visualização de agendamentos
- Atualização de status dos agendamentos

### Para Pacientes
- Cadastro e login
- Visualização de horários disponíveis
- Criação de agendamentos
- Visualização de agendamentos próprios

## 📋 Mapa de Rotas da API

### 🔐 **Autenticação** (`/auth`)
- `POST /auth/login` - Autenticar usuário (médico/paciente)
- `POST /auth/register` - Registrar novo usuário
- `POST /auth/refresh` - Renovar token JWT

### 👥 **Usuários** (`/users`)
- `GET /users/me` - Obter dados do usuário logado
- `PUT /users/me` - Atualizar dados do usuário logado
- `DELETE /users/me` - Deletar conta do usuário logado

### 👨‍⚕️ **Médicos** (`/doctors`)
- `DELETE /doctors` - Deletar perfil de médico
- `GET /doctors/:id/exists` - Verificar se médico existe

### 📅 **Disponibilidades** (`/doctors/:doctorId/availability`)
- `POST /doctors/:doctorId/availability` - Criar disponibilidade
- `GET /doctors/:doctorId/availability` - Listar disponibilidades do médico
- `PUT /doctors/:doctorId/availability/:id` - Atualizar disponibilidade
- `DELETE /doctors/:doctorId/availability/:id` - Deletar disponibilidade específica
- `DELETE /doctors/:doctorId/availability` - Deletar todas disponibilidades do médico

### 🗓️ **Agendamentos** (`/schedules`)
- `POST /schedules` - Criar agendamento (pacientes)
- `GET /schedules/me` - Listar agendamentos do usuário logado
- `GET /schedules/:id` - Obter agendamento por ID
- `PUT /schedules/:id/cancel` - Cancelar agendamento
- `PUT /schedules/:id/complete` - Marcar agendamento como concluído (médicos)
- `DELETE /schedules/:id` - Deletar agendamento

### 🔍 **Busca de Horários** (`/availability`)
- `GET /availability/slots` - Buscar slots disponíveis
  - Query params: `doctorId`, `date`, `startDate`, `endDate`

### 📊 **Relatórios**
- `GET /doctors/:doctorId/schedules` - Agendamentos do médico

### 🔧 **Utilitários**
- `GET /hello-world` - Verificação de saúde da API

## 🛡️ Segurança Implementada

- **Autenticação JWT** em todas as rotas (exceto auth)
- **Autorização por perfil** (DOCTOR/PATIENT)
- **Rate limiting** implementado com @nestjs/throttler
- **Validação de DTOs** com Zod
- **Sanitização de inputs**

### Rate Limiting Configurado
- **Autenticação**: 5 tentativas/min (login), 3 tentativas/5min (register)
- **Agendamentos**: 20 criações/min por usuário
- **Disponibilidades**: 15 criações/min por médico
- **Consultas**: 100 requests/min para busca de horários

## 🐛 Resolução de Problemas

### Erro de conexão com banco
- Verifique se o PostgreSQL está rodando: `docker ps`
- Confirme as credenciais no arquivo `.env`
- Teste a conexão: `npx prisma db pull`

### Erro de migração
```bash
# Reset completo do banco (cuidado em produção!)
npx prisma migrate reset --force

# Aplicar migrações novamente
npx prisma migrate deploy
```

### Porta já em uso
```bash
# Verificar qual processo está usando a porta
lsof -ti:3000

# Matar o processo se necessário
kill $(lsof -ti:3000)
```

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação da API em `/api`
2. Consulte os logs da aplicação
3. Execute os testes para validar o ambiente

## 📄 Licença

Este projeto está sob a licença MIT. Veja o arquivo [LICENSE](LICENSE) para mais detalhes.

---

**Desenvolvido como parte do desafio técnico para desenvolvedor(a) Full-Stack**