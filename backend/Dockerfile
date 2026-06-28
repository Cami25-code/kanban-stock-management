FROM php:8.2-apache

RUN apt-get update && apt-get install -y --no-install-recommends \
        libzip-dev \
        libonig-dev \
        unzip \
    && docker-php-ext-install pdo_mysql mbstring bcmath zip pcntl \
    && find /etc/apache2/mods-enabled/ -name 'mpm_*.load' -delete \
    && find /etc/apache2/mods-enabled/ -name 'mpm_*.conf' -delete \
    && a2dissite 000-default.conf default-ssl.conf || true \
    && rm -f /etc/apache2/sites-enabled/*.conf || true \
    && a2enmod mpm_prefork rewrite \
    && rm -rf /var/lib/apt/lists/*

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

WORKDIR /var/www/html

COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader --prefer-dist

COPY . .
RUN composer dump-autoload --optimize --no-dev \
    && php artisan package:discover --ansi

COPY docker/apache-vhost.conf /etc/apache2/sites-enabled/000-default.conf
COPY docker/entrypoint.sh /usr/local/bin/entrypoint.sh
RUN chmod +x /usr/local/bin/entrypoint.sh

EXPOSE 80

ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
