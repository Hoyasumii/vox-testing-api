#!/bin/bash

# Script para executar testes E2E com setup completo do ambiente

set -e

echo "🔧 Configurando ambiente de teste..."

# Carregar variáveis de ambiente de teste
export $(cat .env.testing | xargs)

echo "� Iniciando containers de teste..."
docker-compose -f docker-compose.test.yml up -d

echo "⏳ Aguardando containers ficarem prontos..."
sleep 10

echo "�📦 Instalando dependências..."
pnpm install

echo "🗃️ Configurando banco de dados de teste..."
# Aplicar migrações no banco de teste
pnpm db:test:migrate

echo "🧬 Gerando cliente Prisma..."
pnpm prisma generate

echo "🧪 Executando testes E2E..."
pnpm test:e2e

echo "🧹 Limpando ambiente de teste..."
docker-compose -f docker-compose.test.yml down

echo "✅ Testes E2E concluídos!"
