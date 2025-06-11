# Apresentação - Viabilidade DaaS

Apresentação sobre **Viabilidade operacional e econômica de um serviço Drone-as-a-Service** para entregas urbanas.

## 🚀 Como Apresentar

### Opção 1: Apresentação Interativa (Recomendada)

1. **Instalar dependências:**
   ```bash
   npm install
   ```

2. **Iniciar apresentação:**
   ```bash
   npm start
   ```
   Ou:
   ```bash
   npm run present
   ```

3. **Abrir no navegador:**
   - A apresentação abrirá automaticamente em `http://localhost:3000`
   - Use **tela cheia** (F11) para melhor experiência

### Opção 2: Visualização de Slides Individuais

```bash
npm run dev
```

Isso abrirá o índice com todos os slides navegáveis.

## ⌨️ Controles da Apresentação

| Tecla | Ação |
|-------|------|
| `→` ou `Espaço` | Próximo slide |
| `←` ou `Backspace` | Slide anterior |
| `Home` | Primeiro slide |
| `End` | Último slide |
| `F` | Alternar tela cheia |
| `ESC` | Mostrar/ocultar ajuda |
| `R` | Reiniciar apresentação |

## 📄 Gerar PDFs

### Instalar Puppeteer
```bash
npm install
```

### Gerar todos os PDFs
```bash
npm run generate-pdf
```

Isso criará:
- PDFs individuais de cada slide
- PDF da apresentação completa
- PDF do índice

Os arquivos serão salvos na pasta `output/`.

## 📁 Estrutura dos Arquivos

```
├── Slides/
│   ├── index.html              # Índice navegável
│   ├── presentation.html       # Apresentação contínua
│   ├── 1-title.html           # Slide 1: Título
│   ├── 2-context.html         # Slide 2: Problema
│   ├── ...                    # Demais slides
│   └── assets/                # Recursos (imagens, etc.)
├── output/                    # PDFs gerados
├── generate-pdf.js           # Script de geração de PDF
├── package.json             # Dependências
└── README.md               # Este arquivo
```

## 🎯 Recursos da Apresentação

### Apresentação Interativa (`presentation.html`)
- ✅ Navegação por teclado
- ✅ Contador de slides
- ✅ Barra de progresso
- ✅ Animações suaves
- ✅ Modo tela cheia
- ✅ Ajuda integrada

### Geração de PDF
- ✅ PDFs individuais de alta qualidade
- ✅ PDF unificado da apresentação
- ✅ Preservação de formatação e cores
- ✅ Resolução otimizada para impressão

## 🔧 Requisitos

- **Node.js** 14.0.0 ou superior
- **Navegador moderno** (Chrome, Firefox, Safari, Edge)

## 📊 Conteúdo da Apresentação

1. **Título** - Apresentação e contexto
2. **Problema** - Desafios do delivery atual
3. **Oportunidade Regulatória** - Marco regulatório e CAER
4. **Pergunta de Pesquisa** - Questão central do estudo
5. **Objetivos** - Metas e propósitos
6. **Roadmap** - Metodologia e cronograma
7. **Dados** - Fontes e informações
8. **Logística** - Operações e eficiência
9. **Droneports** - Infraestrutura necessária
10. **Fila** - Gestão de demanda
11. **Energia** - Consumo e autonomia
12. **Clima** - Impacto meteorológico
13. **Finanças** - Análise econômica
14. **Riscos** - Análise de sensibilidade
15. **Cronograma** - Planejamento temporal
16. **Resultados Esperados** - Expectativas e entregas
17. **Fim** - Agradecimentos e Q&A

## 🎨 Personalização

### Cores do Tema
- **Azul principal:** `#1e40af`
- **Laranja destaque:** `#f97316`
- **Cinza texto:** `#6b7280`

### Fontes
- **Corpo:** Arial, sans-serif
- **Títulos:** Arial, bold

## 📞 Suporte

Para dúvidas ou problemas:
1. Verifique se o Node.js está instalado
2. Execute `npm install` para instalar dependências
3. Teste a apresentação com `npm start`

---

**Desenvolvido por:** João Paulo Penna  
**Orientador:** Prof. Dr. Christopher Schneider Cerqueira  
**Instituição:** Instituto Tecnológico de Aeronáutica - ITA  
**Ano:** 2024 