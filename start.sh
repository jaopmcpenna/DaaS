#!/bin/bash

echo "🎯 Apresentação - Viabilidade DaaS"
echo "=================================="
echo ""

# Verificar se Node.js está instalado
if ! command -v node &> /dev/null; then
    echo "❌ Node.js não encontrado!"
    echo "   Por favor, instale Node.js: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js encontrado: $(node --version)"

# Verificar se as dependências estão instaladas
if [ ! -d "node_modules" ]; then
    echo "📦 Instalando dependências..."
    npm install
fi

echo ""
echo "🚀 Iniciando apresentação..."
echo "   Acesse: http://localhost:3000"
echo ""
echo "⌨️  Controles:"
echo "   → ou Espaço: Próximo slide"
echo "   ← ou Backspace: Slide anterior"
echo "   F: Tela cheia"
echo "   ESC: Ajuda"
echo ""
echo "📄 Para gerar PDFs: npm run generate-pdf"
echo ""

# Iniciar servidor
npm run present 