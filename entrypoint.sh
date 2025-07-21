#!/bin/sh

echo "🔥 Iniciando Nginx + Backend con supervisord..."

# Ejecutar seed solo una vez
if [ ! -f /app/backend/.seed.lock ]; then
  echo "🌱 Ejecutando seed inicial..."
  npm run build --prefix /app/backend && npm run seed --prefix /app/backend && touch /app/backend/.seed.lock
else
  echo "✅ Seed ya ejecutado previamente."
fi

exec /usr/bin/supervisord -c /etc/supervisord.conf
