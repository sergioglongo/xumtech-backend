# backend/Dockerfile
# Etapa de construcción
FROM node:18-alpine AS builder

WORKDIR /app

# Copiar package.json y package-lock.json explícitamente
COPY package.json package-lock.json ./

# Instalar herramientas de compilación para dependencias nativas (como pg)
RUN apk add --no-cache python3 make g++

# Instalar dependencias de producción usando la bandera moderna y limpiar caché
RUN npm ci --omit=dev && npm cache clean --force

# Copiar el código fuente
COPY . . 

# Etapa de ejecución (multi-stage build para imagen más ligera)
FROM node:18-alpine

WORKDIR /app

# Copiar solo lo necesario desde la etapa builder
COPY --from=builder /app .

# Exponer el puerto
EXPOSE 8001

# Comando para iniciar la aplicación
CMD ["node", "index.js"]