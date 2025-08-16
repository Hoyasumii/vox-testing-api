# Schedule DTOs

Este diretório contém todos os DTOs (Data Transfer Objects) relacionados ao sistema de agendamentos médicos.

## DTOs Disponíveis

### 1. Types/Enums
- **`ScheduleStatus`**: Enum para status do agendamento (`SCHEDULED`, `CANCELED`, `COMPLETED`)

### 2. Input DTOs

#### Criação e Manipulação
- **`CreateScheduleDTO`**: Para criar novos agendamentos
  - `availabilityId`: UUID da disponibilidade do médico
  - `patientId`: UUID do paciente
  - `doctorId`: UUID do médico
  - `scheduledAt`: Data/hora do agendamento

#### Busca
- **`FindScheduleByIdDTO`**: Para buscar agendamento por ID
  - `scheduleId`: UUID do agendamento

- **`FindSchedulesByPatientIdDTO`**: Para buscar agendamentos por paciente
  - `patientId`: UUID do paciente
  - `page`: Número da página (opcional, padrão: 1)
  - `limit`: Limite de itens por página (opcional, padrão: 10, máximo: 100)

- **`FindSchedulesByDoctorIdDTO`**: Para buscar agendamentos por médico
  - `doctorId`: UUID do médico
  - `page`: Número da página (opcional, padrão: 1)
  - `limit`: Limite de itens por página (opcional, padrão: 10, máximo: 100)
  - `startDate`: Data inicial para filtro (opcional)
  - `endDate`: Data final para filtro (opcional)

#### Disponibilidade
- **`GetAvailableSlotsDTO`**: Para obter slots disponíveis de um médico
  - `doctorId`: UUID do médico
  - `startDate`: Data inicial do período
  - `endDate`: Data final do período

- **`IsDoctorAvailableDTO`**: Para verificar se médico está disponível em uma data específica
  - `doctorId`: UUID do médico
  - `targetDate`: Data/hora alvo para verificação

#### Operações
- **`DeleteScheduleDTO`**: Para deletar agendamento
  - `scheduleId`: UUID do agendamento

- **`CancelScheduleDTO`**: Para cancelar agendamento
  - `scheduleId`: UUID do agendamento

- **`CompleteScheduleDTO`**: Para marcar agendamento como concluído
  - `scheduleId`: UUID do agendamento

### 3. Response DTOs

- **`ScheduleResponseDTO`**: Resposta completa de um agendamento
  - `id`: UUID do agendamento
  - `status`: Status atual (`SCHEDULED`, `CANCELED`, `COMPLETED`)
  - `availabilityId`: UUID da disponibilidade
  - `patientId`: UUID do paciente
  - `doctorId`: UUID do médico
  - `scheduledAt`: Data/hora do agendamento
  - `createdAt`: Data de criação (opcional)
  - `updatedAt`: Data de atualização (opcional)

- **`AvailableSlotResponseDTO`**: Resposta de slot de disponibilidade
  - `availabilityId`: UUID da disponibilidade
  - `doctorId`: UUID do médico
  - `dayOfWeek`: Dia da semana (0-6, domingo-sábado)
  - `startHour`: Hora inicial (0-23)
  - `endHour`: Hora final (0-23)
  - `availableDate`: Data específica do slot
  - `isAvailable`: Se o slot está disponível

## Validações

Todos os DTOs incluem validações rigorosas:

- **UUIDs**: Validação de formato UUID v4
- **Datas**: Validação de objetos Date válidos
- **Números**: Validação de tipos e ranges apropriados
- **Enums**: Validação de valores permitidos
- **Paginação**: Limites de page/limit com valores padrão seguros

## Testes

Cada DTO possui um arquivo de teste completo (`.spec.ts`) que verifica:

- ✅ Casos válidos
- ❌ Validação de campos obrigatórios
- ❌ Validação de tipos incorretos
- ❌ Validação de valores fora do range
- ❌ Validação de UUIDs inválidos
- ❌ Casos extremos (null, undefined, strings vazias)

## Uso

```typescript
import { 
  CreateScheduleDTO,
  ScheduleResponseDTO,
  GetAvailableSlotsDTO 
} from '@/dtos';

// Validar dados de entrada
const createData = CreateScheduleDTO.parse({
  availabilityId: "550e8400-e29b-41d4-a716-446655440000",
  patientId: "550e8400-e29b-41d4-a716-446655440001", 
  doctorId: "550e8400-e29b-41d4-a716-446655440002",
  scheduledAt: new Date("2025-08-17T10:00:00Z")
});

// Validação segura
const result = CreateScheduleDTO.safeParse(data);
if (result.success) {
  // Dados válidos
  console.log(result.data);
} else {
  // Tratar erros de validação
  console.error(result.error.issues);
}
```

## Relacionamento com Repository

Estes DTOs foram criados especificamente para atender aos métodos definidos no `ScheduleRepositoryBase`:

- `create()` → `CreateScheduleDTO`
- `findById()` → `FindScheduleByIdDTO`
- `findByPatientId()` → `FindSchedulesByPatientIdDTO`
- `findByDoctorId()` → `FindSchedulesByDoctorIdDTO`
- `delete()` → `DeleteScheduleDTO`
- `getAvailableSlots()` → `GetAvailableSlotsDTO`
- `isDoctorAvailable()` → `IsDoctorAvailableDTO`
- `cancel()` → `CancelScheduleDTO`
- `complete()` → `CompleteScheduleDTO`
