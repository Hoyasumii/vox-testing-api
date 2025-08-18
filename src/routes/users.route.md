# 📋 Especificação das Rotas de Usuários

## 👥 **Usuários** (`/users`)

### Estrutura Base
Todas as rotas de usuários utilizam o prefixo `/users/me` para operações relacionadas ao usuário autenticado.

### Endpoints Disponíveis

#### `GET /users/me` - Obter dados do usuário logado
- **Descrição**: Retorna os dados do usuário autenticado
- **Controller**: `GetUserDataController`
- **Service**: `GetUserContentByIdService`
- **Headers**: 
  - `authorization`: Token JWT do usuário
- **Resposta**: Dados do usuário (sem senha)
- **Códigos de Status**:
  - `200`: Sucesso
  - `401`: Token inválido ou expirado
  - `404`: Usuário não encontrado

#### `PUT /users/me` - Atualizar dados do usuário logado
- **Descrição**: Atualiza os dados do usuário autenticado
- **Controller**: `UpdateUserController`
- **Service**: `UpdateUserService`
- **Headers**: 
  - `authorization`: Token JWT do usuário
- **Body**: `UpdateUserDTO`
  ```typescript
  {
    name?: string;           // Nome do usuário (opcional)
    email?: string;          // Email do usuário (opcional)
    type?: UserType;         // Tipo do usuário (opcional)
    password?: string;       // Nova senha (opcional)
  }
  ```
- **Validações**:
  - Nome: Mínimo 1 caractere (se fornecido)
  - Email: Formato válido (se fornecido)
  - Senha: Mínimo 7 caracteres, deve conter maiúscula, minúscula e caractere especial (se fornecido)
- **Resposta**: Confirmação da atualização
- **Códigos de Status**:
  - `200`: Atualização realizada com sucesso
  - `400`: Dados inválidos
  - `401`: Token inválido ou expirado
  - `404`: Usuário não encontrado
  - `409`: Email já existe (se email foi alterado)

#### `DELETE /users/me` - Deletar conta do usuário logado
- **Descrição**: Remove a conta do usuário autenticado
- **Controller**: `DeleteUserController`
- **Service**: `DeleteUserService`
- **Headers**: 
  - `authorization`: Token JWT do usuário
- **Resposta**: Confirmação da exclusão
- **Códigos de Status**:
  - `200`: Conta deletada com sucesso
  - `401`: Token inválido ou expirado
  - `404`: Usuário não encontrado
  - `500`: Erro interno do servidor

### 🛡️ **Segurança**
- Todas as rotas requerem autenticação via token JWT
- O token deve ser enviado no header `authorization`
- Usuários só podem acessar e modificar seus próprios dados
- Validação de dados de entrada através de DTOs

### 📝 **Validações Específicas**
- **Nome**: String não vazia (quando fornecido)
- **Email**: Formato de email válido (quando fornecido)
- **Senha**: 
  - Mínimo 7 caracteres
  - Pelo menos uma letra maiúscula
  - Pelo menos uma letra minúscula
  - Pelo menos um caractere especial `[-!@#$%^&*(),.?":{}|<>]`
- **Tipo de Usuário**: Deve ser um valor válido do enum `UserType`

### 🔗 **Dependências**
- **Módulo**: `UsersModule`
- **Controllers**: 
  - `DeleteUserController`
  - `GetUserDataController` 
  - `UpdateUserController`
- **Services**:
  - `DeleteUserService`
  - `GetUserContentByIdService`
  - `UpdateUserService`
- **DTOs**: `UpdateUserDTO`, `UserPasswordDTO`

### 📊 **Fluxo de Dados**
1. Cliente envia requisição com token JWT
2. Middleware de autenticação valida o token
3. Controller extrai o token do header
4. Service processa a operação usando o token para identificar o usuário
5. Resposta é retornada ao cliente

### 🧪 **Testes**
- **Testes Unitários**: Cobertura completa dos controllers e módulo
- **Mocks**: Services são mockados nos testes de controller
- **Cenários Testados**:
  - Operações com sucesso
  - Tratamento de erros
  - Validação de entrada
  - Casos edge (dados vazios, tokens inválidos)
