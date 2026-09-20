#!/usr/bin/env bash
# Moon Auto sitesini VPS'e kurar/günceller.
# Kullanım: scripts/deploy-vps.sh [kullanıcı]   (varsayılan root)
set -euo pipefail
USER_="${1:-root}"
HOST=185.165.46.52
PORT=9382
KEY=~/.ssh/moon_ssh
SSH="ssh -i $KEY -p $PORT -o BatchMode=yes $USER_@$HOST"
cd "$(dirname "$0")/.."

echo "▶ build (ön eksiz, moonauto.com.tr için)"; npm run build >/dev/null
echo "▶ sunucu hazırlığı"
$SSH 'set -e; command -v nginx >/dev/null || { apt-get update -qq && DEBIAN_FRONTEND=noninteractive apt-get install -y -qq nginx rsync certbot python3-certbot-nginx; }; mkdir -p /var/www/moonauto'
echo "▶ dosyalar"; rsync -az --delete -e "ssh -i $KEY -p $PORT" dist/ "$USER_@$HOST:/var/www/moonauto/"
echo "▶ nginx"
scp -i $KEY -P $PORT deploy/nginx-moonauto.conf "$USER_@$HOST:/etc/nginx/sites-available/moonauto.conf"
$SSH 'set -e; ln -sf /etc/nginx/sites-available/moonauto.conf /etc/nginx/sites-enabled/moonauto.conf; rm -f /etc/nginx/sites-enabled/default; nginx -t && systemctl reload nginx; ufw status 2>/dev/null | grep -q active && ufw allow "Nginx Full" >/dev/null || true'
echo "✔ yayınlandı → http://$HOST  (DNS sonrası: certbot --nginx -d moonauto.com.tr -d www.moonauto.com.tr)"
