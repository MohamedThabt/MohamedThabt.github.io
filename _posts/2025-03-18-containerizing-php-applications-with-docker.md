---
title: "Containerizing PHP Applications with Docker"
date: 2025-03-18
categories: [DevOps, Backend]
tags: [docker, php, containers, devops, deployment]
---

# Containerizing PHP Applications with Docker

Docker has revolutionized how we deploy and manage applications. In this guide, I'll show you how to containerize a PHP application, making it easy to develop, test, and deploy consistently across any environment.

## Why Containerize PHP Apps?

- **Consistency**: Eliminates "works on my machine" problems
- **Isolation**: Sandboxes your application dependencies
- **Scalability**: Makes horizontal scaling straightforward
- **DevOps Integration**: Simplifies CI/CD pipelines

## Basic Dockerfile for PHP

Let's start with a simple Dockerfile for a PHP application:

```dockerfile
FROM php:8.2-apache

# Install dependencies
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    && docker-php-ext-install zip pdo pdo_mysql

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy application files
COPY . .

# Set permissions
RUN chown -R www-data:www-data /var/www/html
```

## Adding Composer

For PHP applications using Composer:

```dockerfile
FROM php:8.2-apache

# Install dependencies and extensions
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install zip pdo pdo_mysql

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Enable Apache mod_rewrite
RUN a2enmod rewrite

# Set working directory
WORKDIR /var/www/html

# Copy composer files first to leverage Docker cache
COPY composer.json composer.lock ./
RUN composer install --no-scripts --no-autoloader

# Copy the rest of the application
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize

# Set permissions
RUN chown -R www-data:www-data /var/www/html
```

## Docker Compose for PHP + MySQL

For applications that need a database, use Docker Compose:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      dockerfile: Dockerfile
    ports:
      - "8000:80"
    volumes:
      - ./:/var/www/html
    depends_on:
      - db
    environment:
      DB_HOST: db
      DB_DATABASE: app_db
      DB_USERNAME: app_user
      DB_PASSWORD: app_password

  db:
    image: mysql:8.0
    ports:
      - "3306:3306"
    environment:
      MYSQL_DATABASE: app_db
      MYSQL_USER: app_user
      MYSQL_PASSWORD: app_password
      MYSQL_ROOT_PASSWORD: root_password
    volumes:
      - mysql_data:/var/lib/mysql

volumes:
  mysql_data:
```

## Optimizing for Production

For production environments, you'll want to optimize your Docker setup:

```dockerfile
FROM php:8.2-fpm as builder

# Install dependencies for building
RUN apt-get update && apt-get install -y \
    libzip-dev \
    zip \
    unzip \
    git \
    curl \
    && docker-php-ext-install zip pdo pdo_mysql opcache

# Install Composer
COPY --from=composer:latest /usr/bin/composer /usr/bin/composer

# Set working directory
WORKDIR /app

# Copy composer files
COPY composer.json composer.lock ./
RUN composer install --no-dev --no-scripts --no-autoloader

# Copy application files
COPY . .

# Generate optimized autoloader
RUN composer dump-autoload --optimize --no-dev

# Production image
FROM php:8.2-fpm

# Copy built application
COPY --from=builder /app /var/www/html

# Install production dependencies only
RUN apt-get update && apt-get install -y \
    libzip-dev \
    && docker-php-ext-install zip pdo pdo_mysql opcache

# PHP Configuration
COPY docker/php/production.ini /usr/local/etc/php/conf.d/app.ini

# Set permissions
RUN chown -R www-data:www-data /var/www/html
```

## Security Considerations

1. **Run as non-root user**: Add `USER www-data` at the end of your Dockerfile
2. **Use specific version tags**: Avoid `latest` tags for reproducible builds
3. **Scan images for vulnerabilities**: Use tools like Docker Scout or Trivy
4. **Minimize image size**: Use multi-stage builds and Alpine-based images
5. **Securely handle environment variables**: Never hardcode sensitive data

## Debugging with Docker

To debug PHP applications in Docker containers:

1. Install Xdebug:

```dockerfile
RUN pecl install xdebug \
    && docker-php-ext-enable xdebug
```

2. Configure Xdebug:

```ini
xdebug.mode=develop,debug
xdebug.client_host=host.docker.internal
xdebug.start_with_request=yes
```

## Conclusion

Containerizing PHP applications with Docker provides consistency, simplifies deployment, and improves development workflows. By following these patterns, you can create efficient and secure containers for your PHP applications, whether they're simple websites or complex Laravel applications.