# API - Sistema de Agendamento Médico

Sistema backend para agendamento médico desenvolvido com NestJS, onde médicos podem disponibilizar seus horários e pacientes podem realizar agendamentos.

## 🚀 Tecnologias Utilizadas

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