#!/bin/sh
set -e

# Remove any MPM other than prefork to prevent "More than one MPM loaded"
find /etc/apache2/mods-enabled/ -name 'mpm_*.load' ! -name 'mpm_prefork.load' -delete 2>/dev/null || true
find /etc/apache2/mods-enabled/ -name 'mpm_*.conf' ! -name 'mpm_prefork.conf' -delete 2>/dev/null || true

chown -R www-data:www-data storage bootstrap/cache
php artisan config:clear

echo "=== [DIAG] mods-enabled/ ==="
ls /etc/apache2/mods-enabled/
echo "=== [DIAG] apache2 -t ==="
apache2 -t 2>&1 || true
echo "=== [DIAG] grep LoadModule/mpm dans apache2.conf ==="
grep -n "LoadModule\|mpm" /etc/apache2/apache2.conf 2>/dev/null || true

exec apache2-foreground
