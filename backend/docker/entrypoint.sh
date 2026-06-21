#!/bin/sh
set -e

chown -R www-data:www-data storage bootstrap/cache
php artisan config:clear

exec apache2-foreground
