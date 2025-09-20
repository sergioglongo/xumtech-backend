#!/bin/sh

# El comando 'set -e' asegura que el script se detendrá si algún comando falla.
set -e

# da tiempo a que inicie la base de datos.
echo "Esperando a que la base de datos esté lista..."
sleep 10

echo "Ejecutando migraciones de la base de datos..."
npm run db:migrate

echo "Ejecutando seeders de la base de datos..."
npm run db:seed

# Finalmente, ejecuta el comando principal de la aplicación
exec "$@"