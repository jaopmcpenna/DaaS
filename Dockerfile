# Dockerfile para estudo de viabilidade Drone-as-a-Service
FROM continuumio/miniconda3:latest

LABEL maintainer="TG-1 Drone-as-a-Service"
LABEL description="Ambiente reprodutível para estudo de viabilidade DaaS"

# Instalar dependências do sistema necessárias para osmnx e outros pacotes
RUN apt-get update && apt-get install -y \
    build-essential \
    gdal-bin \
    libgdal-dev \
    libspatialindex-dev \
    git \
    && rm -rf /var/lib/apt/lists/*

# Configurar diretório de trabalho
WORKDIR /app

# Copiar arquivo de environment e instalar dependências
COPY environment.yml .
RUN conda env create -f environment.yml

# Ativar environment por padrão
RUN echo "conda activate drone-daas" >> ~/.bashrc
SHELL ["/bin/bash", "--login", "-c"]

# Copiar código fonte
COPY . .

# Instalar package em modo development
RUN conda run -n drone-daas pip install -e .

# Expor porta para jupyter notebook (opcional)
EXPOSE 8888

# Command padrão
CMD ["conda", "run", "-n", "drone-daas", "bash"]
