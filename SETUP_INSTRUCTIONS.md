# Setup Instructions - Drone-as-a-Service Study

## Estrutura do Projeto

A estrutura criada segue as melhores práticas para projetos científicos reprodutíveis:

```
TG-1/
├── configs/                    # Parâmetros do estudo
│   └── study_config.yml       # Configuração principal
├── data/                      # Dados do projeto
│   ├── raw/                   # Dados brutos do Nekt
│   ├── processed/             # Dados processados
│   └── results/               # Resultados das análises
├── src/                       # Código fonte
│   ├── cli/                   # Scripts CLI
│   │   └── main.py           # Entry point principal
│   └── core/                  # Funções testáveis
│       ├── config_loader.py   # Carregamento de configs
│       └── data_validator.py  # Validação de dados
├── tests/                     # Testes unitários
│   └── test_config_loader.py
├── environment.yml            # Dependências conda
├── Dockerfile                # Container reprodutível
├── pyproject.toml            # Configurações do projeto
├── setup.py                  # Instalação do package
├── mypy.ini                  # Configuração type checking
└── .github/workflows/ci.yml  # Pipeline CI/CD
```

## Configuração do Ambiente

### 1. Criar Ambiente Conda

```bash
# Criar ambiente a partir do environment.yml
conda env create -f environment.yml

# Ativar ambiente
conda activate drone-daas
```

### 2. Instalar Package em Modo Development

```bash
# Instalar o package localmente
pip install -e .

# Ou com dependências de desenvolvimento
pip install -e ".[dev]"
```

### 3. Verificar Instalação

```bash
# Testar CLI
daas-run --help

# Executar testes
pytest

# Verificar formatação
black --check src/ tests/

# Type checking
mypy src/
```

## Uso Básico

### CLI Commands

```bash
# Validar dados de entrada
daas-run --validate-data --verbose

# Executar análise completa (quando implementada)
daas-run --run-analysis --config configs/study_config.yml

# Usar configuração personalizada
daas-run --config path/to/custom_config.yml --verbose
```

### Desenvolvimento

1. **Adicionar novas funcionalidades**:
   - Código principal em `src/core/`
   - Scripts CLI em `src/cli/`
   - Testes correspondentes em `tests/`

2. **Configurações**:
   - Parâmetros do estudo em `configs/study_config.yml`
   - Ajustar dependências em `environment.yml`

3. **Dados**:
   - Dados do Nekt em `data/raw/`
   - Resultados processados em `data/processed/`
   - Outputs finais em `data/results/`

### Docker (Ambiente Reprodutível)

```bash
# Build do container
docker build -t drone-daas .

# Executar container
docker run -it --rm -v $(pwd)/data:/app/data drone-daas

# Executar análise no container
docker run -it --rm -v $(pwd)/data:/app/data drone-daas conda run -n drone-daas daas-run --validate-data
```

## CI/CD Pipeline

O pipeline GitHub Actions automaticamente:

1. **Formata código** com Black
2. **Verifica tipos** com MyPy
3. **Executa testes** com Pytest
4. **Gera coverage** reports

## Próximos Passos

1. **Adicionar dados**: Colocar dados do Nekt em `data/raw/`
2. **Implementar análises**: Desenvolver módulos específicos em `src/core/`
3. **Expandir testes**: Adicionar cobertura completa de testes
4. **Documentar**: Criar documentação detalhada das análises

## Configuração Personalizada

O arquivo `configs/study_config.yml` contém todos os parâmetros configuráveis:

- **Drone parameters**: Especificações técnicas dos drones
- **Logistics parameters**: Parâmetros operacionais e de rotas
- **Economic parameters**: Custos e parâmetros financeiros
- **Simulation parameters**: Configurações para Monte Carlo e cenários
- **Risk parameters**: Fatores e distribuições de risco

Ajuste estes parâmetros conforme necessário para seu estudo específico.
