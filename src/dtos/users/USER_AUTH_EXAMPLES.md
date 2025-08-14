# UserAuthResponseDTO - Exemplo de Uso

## Propósito

O `UserAuthResponseDTO` foi criado especificamente para operações de autenticação que precisam retornar apenas o **ID** e a **senha hasheada** do usuário. É usado principalmente no método `getByEmail` para verificação de credenciais.

## Estrutura

```typescript
{
  id: string (UUID),
  password: string
}
```

## Casos de Uso

### 1. Autenticação de Login

```typescript
import { UserAuthResponseDTO, GetUserByEmailDTO } from '@/dtos/users';

class AuthService {
  async authenticate(email: string, plainPassword: string) {
    // Buscar usuário por email
    const emailDTO = GetUserByEmailDTO.parse({ email });
    const user = await this.userRepository.getByEmail(emailDTO);
    
    if (!user) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    
    // user é do tipo UserAuthResponseDTO
    const isValidPassword = await this.passwordHasher.compare(
      plainPassword, 
      user.password
    );
    
    if (!isValidPassword) {
      throw new UnauthorizedError('Credenciais inválidas');
    }
    
    // Retornar token com o ID do usuário
    return this.generateToken(user.id);
  }
}
```

### 2. Implementação no Repository

```typescript
import { UserAuthResponseDTO, GetUserByEmailDTO } from '@/dtos/users';

class UsersRepository extends UsersRepositoryBase {
  async getByEmail(data: GetUserByEmailDTO): Promise<UserAuthResponseDTO | null> {
    const user = await this.prisma.user.findUnique({
      where: { email: data.email },
      select: {
        id: true,
        password: true,
        // Não retorna outros campos por segurança
      }
    });
    
    if (!user) {
      return null;
    }
    
    // Validar e retornar dados tipados
    return UserAuthResponseDTO.parse(user);
  }
}
```

### 3. Diferença dos Outros DTOs

```typescript
// UserResponseDTO - Para operações normais (SEM password)
const publicUser = await userRepository.getById({ id: userId });
// { id, name, email, type, createdAt, updatedAt }

// UserAuthResponseDTO - Para autenticação (APENAS id e password)
const authUser = await userRepository.getByEmail({ email });
// { id, password }
```

## Benefícios de Segurança

1. **Exposição Mínima**: Retorna apenas dados necessários para autenticação
2. **Tipagem Forte**: Garante que apenas `id` e `password` sejam retornados
3. **Separação de Responsabilidades**: DTO específico para casos de auth
4. **Prevenção de Vazamentos**: Não expõe dados sensíveis como email, nome, etc.

## Validações

- ✅ **ID**: Deve ser um UUID válido
- ✅ **Password**: String obrigatória (pode ser vazia)
- ✅ **Campos Extra**: São ignorados automaticamente pelo Zod
- ✅ **Campos Faltantes**: Rejeitados com erro de validação

## Exemplo Completo

```typescript
import { 
  UserAuthResponseDTO, 
  GetUserByEmailDTO 
} from '@/dtos/users';
import { UnauthorizedError } from '@/errors';

export class LoginController {
  async login(req: Request, res: Response) {
    const { email, password } = req.body;
    
    try {
      // Validar input
      const emailDTO = GetUserByEmailDTO.parse({ email });
      
      // Buscar usuário (retorna UserAuthResponseDTO)
      const user = await this.userRepository.getByEmail(emailDTO);
      
      if (!user) {
        throw new UnauthorizedError('Email ou senha inválidos');
      }
      
      // Verificar senha
      const isValid = await bcrypt.compare(password, user.password);
      
      if (!isValid) {
        throw new UnauthorizedError('Email ou senha inválidos');
      }
      
      // Gerar token JWT
      const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET);
      
      return res.json({ 
        token,
        message: 'Login realizado com sucesso' 
      });
      
    } catch (error) {
      if (error instanceof UnauthorizedError) {
        return res.status(401).json({ error: error.message });
      }
      throw error;
    }
  }
}
```

## Diferenças dos DTOs

| DTO | Campos | Uso |
|-----|--------|-----|
| `UserResponseDTO` | id, name, email, type, createdAt, updatedAt | Operações gerais (CRUD) |
| `UserAuthResponseDTO` | id, password | **Autenticação apenas** |
| `CreateUserDTO` | name, email, password, type | Criação de usuários |
| `UpdateUserDTO` | name?, email?, type? | Atualização (sem password) |
