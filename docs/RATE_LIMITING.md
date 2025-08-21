# 🛡️ Rate Limiting - Sistema de Agendamento Médico

## 📋 Visão Geral

O sistema implementa **rate limiting** em múltiplas camadas para proteger a API contra:
- **Ataques DDoS** e sobrecarga
- **Brute force** em endpoints de autenticação
- **Spam** de requisições
- **Uso abusivo** de recursos

## 🎯 Configuração Global

### Limites Base
```typescript
// Configuração no AppModule
ThrottlerModule.forRoot([
  {
    name: "short",
    ttl: 1000,     // 1 segundo
    limit: 3,      // 3 requests por segundo
  },
  {
    name: "medium", 
    ttl: 10000,    // 10 segundos
    limit: 20,     // 20 requests por 10 segundos
  },
  {
    name: "long",
    ttl: 60000,    // 1 minuto  
    limit: 100,    // 100 requests por minuto
  },
])
```

## 🔐 Limites por Endpoint

### **Autenticação (Críticos)**

| Endpoint | Limite | Janela | Estratégia |
|----------|--------|--------|------------|
| `POST /auth/login` | 5 req | 1 min | Por IP - Anti brute force |
| `POST /auth/register` | 3 req | 5 min | Por IP - Anti spam |
| `POST /auth/refresh` | 10 req | 1 min | Por usuário - Uso normal |

### **Operações de Negócio**

| Endpoint | Limite | Janela | Estratégia |
|----------|--------|--------|------------|
| `POST /schedules` | 20 req | 1 min | Por usuário - Criação de agendamentos |
| `POST /doctors/:id/availability` | 15 req | 1 min | Por usuário - Criação de disponibilidade |
| `GET /availability/slots` | 100 req | 1 min | Por IP - Consultas públicas |

## 🔧 Guards Customizados

### **AuthThrottlerGuard**
- **Uso**: Endpoints de autenticação
- **Identificação**: Por IP
- **Objetivo**: Prevenir ataques de força bruta

### **UserThrottlerGuard** 
- **Uso**: Endpoints autenticados
- **Identificação**: Por usuário logado (ou IP se anônimo)
- **Objetivo**: Controle por usuário individual

## 🚨 Respostas de Rate Limiting

### **HTTP 429 - Too Many Requests**
```json
{
  "statusCode": 429,
  "message": "Muitas tentativas de autenticação. Tente novamente em alguns minutos.",
  "error": "Too Many Requests"
}
```

### **Headers de Resposta**
```http
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 2
X-RateLimit-Reset: 1640995200
```

## 📊 Métricas e Monitoramento

### **Logs Estruturados**
```typescript
// Exemplo de log quando rate limit é atingido
{
  "level": "warn",
  "message": "Rate limit exceeded",
  "ip": "192.168.1.1",
  "userId": "user_123",
  "endpoint": "/auth/login",
  "timestamp": "2024-01-01T12:00:00Z"
}
```

## 🏥 Justificativas para Sistema Médico

### **Por que esses limites?**

1. **Login (5/min)**: Permite recuperação de senha legítima, bloqueia bots
2. **Registro (3/5min)**: Evita criação massiva de contas falsas  
3. **Agendamentos (20/min)**: Permite uso normal, evita spam
4. **Disponibilidades (15/min)**: Médicos configuram horários, não precisam de velocidade extrema

## 🔄 Configuração Adaptativa

### **Ambiente de Desenvolvimento**
```typescript
// Limites mais relaxados para testes
{
  name: "dev",
  ttl: 60000,
  limit: 1000, // 1000 req/min
}
```

### **Ambiente de Produção**
```typescript
// Limites restritivos para segurança
{
  name: "prod", 
  ttl: 60000,
  limit: 100, // 100 req/min
}
```

## 🧪 Testes Implementados

- ✅ **Teste de limite respeitado**
- ✅ **Teste de bloqueio após exceder**
- ✅ **Teste de headers de rate limiting**
- ✅ **Teste por diferentes IPs**
- ✅ **Teste por usuários autenticados**

## 🚀 Benefícios Alcançados

1. **🛡️ Segurança**: Proteção contra ataques automatizados
2. **⚡ Performance**: Mantém API responsiva sob carga
3. **💰 Custos**: Evita consumo excessivo de recursos
4. **📊 Qualidade**: Distribui acesso de forma justa
5. **🏥 Compliance**: Atende requisitos de segurança médica

---

> **Nota**: Este sistema de rate limiting foi implementado seguindo as melhores práticas de segurança para APIs REST, com foco especial nas necessidades de um sistema de agendamento médico.
