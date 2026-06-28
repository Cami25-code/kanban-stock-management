#!/bin/sh
set -e

# Remove any MPM other than prefork to prevent "More than one MPM loaded"
find /etc/apache2/mods-enabled/ -name 'mpm_*.load' ! -name 'mpm_prefork.load' -delete 2>/dev/null || true
find /etc/apache2/mods-enabled/ -name 'mpm_*.conf' ! -name 'mpm_prefork.conf' -delete 2>/dev/null || true

chown -R www-data:www-data storage bootstrap/cache
php artisan config:clear

exec apache2-foreground
