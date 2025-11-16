# ============================================
# DOCKERFILE - BUILD MULTI-ESTÁGIO
# ============================================
# Este arquivo cria uma imagem Docker otimizada
# em dois estágios: build e produção

# ============================================
# ESTÁGIO 1: BUILD
# ============================================
# Usa Node.js 18 Alpine (versão leve)
FROM node:18-alpine AS build

# Define diretório de trabalho
WORKDIR /app

# Copia arquivos de dependências
COPY package*.json ./

# Instala dependências
# --legacy-peer-deps resolve possíveis conflitos
RUN npm ci --legacy-peer-deps

# Copia todo o código fonte
COPY . .

# Build da aplicação para produção
# Gera arquivos otimizados na pasta /dist
RUN npm run build

# ============================================
# ESTÁGIO 2: PRODUÇÃO
# ============================================
# Usa Nginx Alpine para servir a aplicação
FROM nginx:alpine

# Copia arquivos buildados do estágio anterior
COPY --from=build /app/dist /usr/share/nginx/html

# Copia configuração customizada do Nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Expõe a porta 80
EXPOSE 80

# Comando para iniciar o Nginx
# daemon off mantém o processo em foreground
CMD ["nginx", "-g", "daemon off;"]
