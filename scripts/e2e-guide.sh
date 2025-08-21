#!/bin/bash

set -e

echo "🎯 GUIA COMPLETO PARA 100% DOS TESTES E2E"
echo "==========================================="
echo ""

echo "📊 SITUAÇÃO ATUAL:"
echo "✅ Funcionando (16/16): auth-login, auth-register, app"
echo "🔧 Problemas identificados nos outros módulos:"
echo "   - Rotas incorretas (ex: /me deveria ser /users/me)"
echo "   - Formato de resposta (res.body vs res.body.data)"
echo "   - Validações de UUID"
echo "   - Lógica de negócio específica"
echo ""

echo "🚀 EXECUTANDO TESTES QUE FUNCIONAM 100%:"
echo ""

# Verificar se o Docker está rodando
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker não está rodando. Por favor, inicie o Docker."
    exit 1
fi

# Executar testes que funcionam
echo "🧪 Executando testes funcionais..."
./scripts/test-e2e-core.sh

echo ""
echo "🔧 PRÓXIMOS PASSOS PARA 100% DOS TESTES:"
echo ""
echo "1. Corrigir rotas nos testes:"
echo "   - users: /me → /users/me"
echo "   - schedules: verificar rotas corretas"
echo "   - availability: verificar rotas corretas"
echo ""
echo "2. Corrigir formato de resposta:"
echo "   - Trocar res.body por res.body.data em todos os testes"
echo ""
echo "3. Corrigir validações:"
echo "   - Usar UUIDs válidos nos testes"
echo "   - Ajustar dados de entrada conforme validação da API"
echo ""
echo "4. Verificar dependências:"
echo "   - Garantir que helpers como createTestSchedule funcionem"
echo "   - Verificar se todas as rotas existem na API"
echo ""

echo "📋 COMANDOS ÚTEIS:"
echo ""
echo "# Executar apenas testes funcionais:"
echo "./scripts/test-e2e-core.sh"
echo ""
echo "# Executar teste específico:"
echo "docker-compose -f docker-compose.test.yml up -d"
echo "pnpm test:e2e test/routes/users.e2e-spec.ts"
echo "docker-compose -f docker-compose.test.yml down"
echo ""
echo "# Executar todos os testes:"
echo "./scripts/test-e2e.sh"
echo ""

echo "✅ STATUS: 16/68 testes funcionando (23.5%)"
echo "🎯 META: Corrigir os 52 testes restantes"
