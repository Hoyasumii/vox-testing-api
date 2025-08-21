- [x] Implementar o Doctor
- [x] Implementar o Doctor Availability
- [x] Adicionar o CacheableRepository
- [x] Colocar o PUB/SUB como handler no RepositoryBase
- [x] Ajeitar o Cache na camada de Serviços
- [x] Implementar o Schedule
- [x] Criar o sistema de mensageria na camada de Serviços
- [x] Implementar padrão createZodDto em todos os controllers
- [x] Adicionar tags OpenAPI para agrupamento de rotas
- [x] Criar as Rotas
- [x] Criar os Testes E2E
- [x] Implementar uma feature de Listar as consultas do médico

## 📋 Mapa de Rotas da API

### 🔐 **Autenticação** (`/auth`) - Tag: "🔐 Autenticação"
- [x] `POST /auth/login` - Autenticar usuário (médico/paciente)
- [x] `POST /auth/register` - Registrar novo usuário
- [x] `POST /auth/refresh` - Renovar token JWT

### 👥 **Usuários** (`/users`) - Tag: "👥 Usuários"
- [x] `GET /users/me` - Obter dados do usuário logado
- [x] `PUT /users/me` - Atualizar dados do usuário logado
- [x] `DELETE /users/me` - Deletar conta do usuário logado

### 👨‍⚕️ **Médicos** (`/doctors`) - Tag: "👨‍⚕️ Médicos"
- [x] `DELETE /doctors` - Deletar perfil de médico
- [x] `GET /doctors/:id/exists` - Verificar se médico existe

### 📅 **Disponibilidades de Médicos** (`/doctors/:doctorId/availability`) - Tag: "📅 Disponibilidades"
- [x] `POST /doctors/:doctorId/availability` - Criar disponibilidade
- [x] `GET /doctors/:doctorId/availability` - Listar disponibilidades do médico
- [x] `PUT /doctors/:doctorId/availability/:id` - Atualizar disponibilidade
- [x] `DELETE /doctors/:doctorId/availability/:id` - Deletar disponibilidade específica
- [x] `DELETE /doctors/:doctorId/availability` - Deletar todas disponibilidades do médico

### 🗓️ **Agendamentos** (`/schedules`) - Tag: "🗓️ Agendamentos"
- [x] `POST /schedules` - Criar agendamento (pacientes)
- [x] `GET /schedules/me` - Listar agendamentos do usuário logado
- [x] `GET /schedules/:id` - Obter agendamento por ID
- [x] `PUT /schedules/:id/cancel` - Cancelar agendamento
- [x] `PUT /schedules/:id/complete` - Marcar agendamento como concluído (médicos)
- [x] `DELETE /schedules/:id` - Deletar agendamento

### 🔍 **Busca de Horários** (`/availability`) - Tag: "🔍 Busca de Horários"
- [x] `GET /availability/slots` - Buscar slots disponíveis
  - Query params: `doctorId`, `date`, `startDate`, `endDate`

### 📊 **Relatórios** (Opcional) - Tag: "📊 Relatórios"
- [x] `GET /doctors/:doctorId/schedules` - Agendamentos do médico
- [ ] `GET /patients/:patientId/schedules` - Agendamentos do paciente

### 🔧 **Utilitários** - Tag: "🔧 Utilitários"
- [x] `GET /hello-world` - Verificação de saúde da API

## 🛡️ **Middleware de Segurança**
- [x] Autenticação JWT em todas as rotas (exceto auth)
- [x] Autorização por perfil (DOCTOR/PATIENT)
- [x] **Rate limiting** implementado com @nestjs/throttler
- [x] Validação de DTOs
- [x] Sanitização de inputs

### 🚨 **Rate Limiting Configurado**
- **Autenticação**: 5 tentativas/min (login), 3 tentativas/5min (register)
- **Agendamentos**: 20 criações/min por usuário
- **Disponibilidades**: 15 criações/min por médico
- **Consultas**: 100 requests/min para busca de horários
- **Documentação completa**: `docs/RATE_LIMITING.md`

## 📝 **Validações por Rota**
- [ ] Verificar se usuário pode acessar recurso (próprios dados)
- [ ] Verificar se médico pode gerenciar suas disponibilidades
- [ ] Verificar se paciente pode criar agendamentos
- [ ] Verificar conflitos de horários
- [ ] Validar datas/horários futuros

Esse findByDoctorId e o findByPatientId está uma porcaria pq ele não tem nenhum filtro e pode retornar uma quantidade gigante de dados. Se eu quiser incrementar ele futuramente eu vou ajeitar esses pontos. Talvez até migrar para um DDD.