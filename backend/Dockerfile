# Stage 1: preparar vendor com a imagem oficial do Composer
FROM composer:2 AS vendor

WORKDIR /app

# Copia o código (use .dockerignore para reduzir o contexto)
COPY . /app

# (DEV) desativa temporariamente bloqueio de advisories se necessário
RUN composer config --global policy.advisories.block false || true

# Instala dependências com limite de memória liberado
RUN COMPOSER_MEMORY_LIMIT=-1 composer install --no-dev --prefer-dist --no-interaction --optimize-autoloader --no-progress

# Gera autoload otimizado dentro do estágio vendor (remove --no-progress aqui)
RUN COMPOSER_MEMORY_LIMIT=-1 composer dump-autoload --optimize --no-dev --no-interaction

# Stage 2: imagem final com PHP-FPM
FROM php:8.2-fpm

ARG WWWUSER=www-data
ARG WWWGROUP=www-data

RUN apt-get update && apt-get install -y \
    git unzip libzip-dev libpng-dev libonig-dev libxml2-dev zip curl \
    && docker-php-ext-install pdo_mysql mbstring exif pcntl bcmath gd zip \
    && pecl install redis && docker-php-ext-enable redis \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /var/www

# Copia o código-fonte
COPY . /var/www

# Copia vendor pronto do estágio vendor (contém autoload otimizado)
COPY --from=vendor /app/vendor /var/www/vendor

# Copia composer.lock (se gerado)
COPY --from=vendor /app/composer.lock /var/www/composer.lock

# Ajusta permissões
RUN chown -R ${WWWUSER}:${WWWGROUP} /var/www \
    && chmod -R 755 /var/www/storage /var/www/bootstrap/cache

EXPOSE 9000

CMD ["php-fpm"]
