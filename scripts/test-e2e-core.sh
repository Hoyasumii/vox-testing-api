#!/bin/bash

# Script para testar apenas os módulos principais já funcionais
echo "🧪 Executando testes E2E dos módulos principais..."

# Verificar se o Docker está rodando
if ! docker ps > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker primeiro."
    exit 1
fi

# Subir containers de teste
echo "🐳 Iniciando containers de teste..."
docker-compose -f docker-compose.test.yml up -d

# Aguardar containers ficarem prontos
echo "⏳ Aguardando containers ficarem prontos..."
sleep 10

# Verificar se os containers estão rodando
if ! docker-compose -f docker-compose.test.yml ps | grep -q "Up"; then
    echo "❌ Erro ao iniciar containers de teste"
    exit 1
fi

# Executar migrações no banco de teste
echo "🔄 Executando migrações no banco de teste..."
DATABASE_URL="postgresql://test_user:test_password@localhost:5433/vox_testing_test" pnpm prisma migrate deploy

# Executar apenas os testes principais que sabemos que funcionam
echo "🎯 Executando testes dos módulos principais..."
pnpm test:e2e test/routes/app.e2e-spec.ts test/routes/auth-login.e2e-spec.ts test/routes/auth-register.e2e-spec.ts

# Capturar código de saída
EXIT_CODE=$?

# Limpar containers
echo "🧹 Limpando containers de teste..."
docker-compose -f docker-compose.test.yml down

if [ $EXIT_CODE -eq 0 ]; then
    echo "✅ Testes principais executados com sucesso!"
else
    echo "❌ Alguns testes falharam. Código de saída: $EXIT_CODE"
fi

exit $EXIT_CODE
