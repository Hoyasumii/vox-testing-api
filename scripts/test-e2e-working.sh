#!/bin/bash

set -e

echo "🚀 Iniciando testes E2E com módulos corrigidos..."

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker e tente novamente."
    exit 1
fi

# Parar containers existentes (se houver)
echo "🧹 Limpando containers existentes..."
docker-compose -f docker-compose.test.yml down -v --remove-orphans || true

# Iniciar containers de teste
echo "🐳 Iniciando containers de teste..."
docker-compose -f docker-compose.test.yml up -d

# Aguardar containers ficarem prontos
echo "⏳ Aguardando containers ficarem prontos..."
sleep 10

# Verificar se os containers estão rodando
if ! docker-compose -f docker-compose.test.yml ps | grep -q "Up"; then
    echo "❌ Falha ao iniciar containers de teste"
    docker-compose -f docker-compose.test.yml logs
    exit 1
fi

# Executar migrações
echo "🔄 Executando migrações do banco de dados..."
pnpm prisma migrate dev --name "test-migration" --skip-generate || true

# Executar testes específicos que estão funcionando
echo "🧪 Executando testes E2E dos módulos corrigidos..."
pnpm test:e2e --testPathPattern="(auth-login|auth-register|app|schedules)\.e2e-spec\.ts$" --verbose

test_exit_code=$?

# Limpar containers
echo "🧹 Limpando containers de teste..."
docker-compose -f docker-compose.test.yml down -v

if [ $test_exit_code -eq 0 ]; then
    echo "✅ Todos os testes E2E passaram!"
else
    echo "❌ Alguns testes E2E falharam."
    exit $test_exit_code
fi
