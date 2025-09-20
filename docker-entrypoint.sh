#!/bin/sh

# El comando 'set -e' asegura que el script se detendrá si algún comando falla.
set -e

# En un entorno real, es crucial esperar a que la base de datos esté disponible.
# Este 'sleep' es un ejemplo simple. Herramientas como 'wait-for-it.sh' o 'dockerize'
# son más robustas para producción.
echo "Esperando a que la base de datos esté lista..."
sleep 10

echo "Ejecutando migraciones de la base de datos..."
npm run db:migrate

echo "Ejecutando seeders de la base de datos..."
npm run db:seed

# Finalmente, ejecuta el comando principal de la aplicación (el CMD del Dockerfile)
exec "$@"