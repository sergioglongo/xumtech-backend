# Usar una imagen oficial de Node.js como base
FROM node:18-alpine

# Establecer el directorio de trabajo dentro del contenedor
WORKDIR /usr/src/app

# Copiar package.json y package-lock.json (si existe)
COPY package*.json ./

# Instalar las dependencias del proyecto
RUN npm install

# Copiar el resto del código fuente de la aplicación
COPY . .

# Dar permisos de ejecución al script de entrada
RUN chmod +x /usr/src/app/docker-entrypoint.sh

# Establecer el script como el punto de entrada del contenedor
ENTRYPOINT ["/usr/src/app/docker-entrypoint.sh"]

# Comando por defecto que se ejecutará después del entrypoint
CMD ["npm", "start"]