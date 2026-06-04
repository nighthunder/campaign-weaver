# Campaign Weaver - Backend

A modern email marketing platform with support for asynchronous queues, distributed workers, Redis caching, and MailerSend integration. Scalable architecture built on Docker.

## 🎯 Features

- **✅ Laravel 11** - Modern PHP Framework
- **✅ Asynchronous Queues** - Redis with multiple workers (mails, default, reports)
- **✅ Distributed Workers** - 3 specialized workers with exponential retry/backoff
- **✅ Redis** - Cache, sessions, queues, rate limiting
- **✅ Horizon Dashboard** - Real-time queue monitoring
- **✅ Email Marketing** - Integration with MailerSend (SMTP)
- **✅ API Authentication** - Laravel Sanctum with personal access tokens
- **✅ Docker Compose** - Complete setup with services (PHP, Nginx, MySQL, Redis)
- **✅ Batch Processing** - Optimized batch sending of campaigns
- **✅ Webhooks** - Tracking of email events (opens, clicks, bounces)
- **✅ Metrics & Analytics** - Metric caching with Redis

## 📋 Requirements

- **Docker** & **Docker Compose**
- **Composer** (optional, to run without Docker)
- **PHP 8.2+** (if you run without Docker)
- **MySQL 8.0+** ou equivalent
- **Redis 7+**

## 🚀 Quick Start

### 1. Clone and configure

```bash
# Clone the repository
git clone https://github.com/seu-repo/campaign-weaver.git
cd campaign-weaver/laravel-backend
```

# Copy environment file
cp .env.example .env

# Install dependencies (if not using Docker)
composer install

# Ready! Create a **README.md profissional e completo** with:

✅ **Seções principais:**
- 🎯 Features
- 📋 Requirements
- 🚀 Quick Start (4 passos)
- 📁 Project Structure
- 🔌 All API Endpoints (with request/response examples)
- 🔄 Detailed Queue System
- 💾 Database
- 🔐 Authentication
- 📧 Integração MailerSend
- 🗄️ Redis Caching
- 📊 Logs
- 🧪 Exemplos com cURL
- 🛠️ Troubleshooting
- 🚢 Deploy production

# See queues statuses
```
docker-compose exec app php artisan queue:metrics
```

# Queues monitoring
Via Artisan Commands

# Process jobs manually (useful for debug)
```
docker-compose exec app php artisan queue:work redis --queue=mails
```

# Cleaning queues (CAREFULLY - remove all jobs)
```
docker-compose exec app php artisan queue:flush redis
```

# Retry of failed jobs
```
docker-compose exec app php artisan queue:retry-batch batch_id
```

# Configuração de Workers
Edite docker-compose.yml para ajustar:

worker1:
```
command: php artisan queue:work redis --queue=default --sleep=3 --tries=3 --timeout=90 --max-jobs=1000
```
worker2:
```
command: php artisan queue:work redis --queue=mails --sleep=1 --tries=5 --timeout=120 --max-jobs=500
```

worker3:
```
command: php artisan queue:work redis --queue=reports --sleep=5 --tries=2 --timeout=300
```

🚢 Deploy (Production)

# Optimized build
```
docker build -t campaign-weaver:latest .
```

# Push to registry
```
docker tag campaign-weaver:latest seu-registry.com/campaign-weaver:latest
docker push seu-registry.com/campaign-weaver:latest
```

# Setup environment
```
export APP_ENV=production
export APP_DEBUG=false
export APP_DEBUG=false
```

Verifying Redis

# Connect to Redis CLI
```
docker-compose exec redis redis-cli
```

# See all the keys (BE CAREFUL - it could be a lot of data in production)
```
KEYS *
```

# See memory usage
```
INFO memory
```

# Flush all (BE CAREFUL!)
```
FLUSHALL
```

📊 Logs
Visualize Logs

# App's logs
```
docker-compose logs -f app
```

# Workers logs
```
docker-compose logs -f worker1
```

# Error logs
```
docker-compose exec app tail -f storage/logs/laravel.log
```

Log configuration in .env:
```
LOG_LEVEL=debug  # debug, info, notice, warning, error, critical, alert, emergency
```

Log levels:

🧪 Testing the API with cURL

# 1. Register
```
curl -X POST http://localhost:8080/api/register \
-H "Content-Type: application/json" \
-d '{
"name":"Test User",
"email":"test@example.com",
"password":"password123",
"password_confirmation":"password123"
}'
```

# 2. Login
```
TOKEN=$(curl -X POST http://localhost:8080/api/login \
-H "Content-Type: application/json" \
-d '{
"email":"test@example.com",
"password":"password123"
}' | jq -r '.token')
```

# 3. Listing campaigns
```
curl -H "Authorization: Bearer $TOKEN" \
http://localhost:8080/api/campaigns
```

# 4. Create a contact list
```
curl -X POST http://localhost:8080/api/contact-lists \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"name":"My List","description":"Test list"}'
```

# 5. Import contacts
```
curl -X POST http://localhost:8080/api/contact-lists/import \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
"contact_list_id":1,
"subscribers":[
{"email":"user1@example.com","first_name":"John"},
{"email":"user2@example.com","first_name":"Jane"}
]
}'
```

# 6. Create Campaign
```
CAMPAIGN=$(curl -X POST http://localhost:8080/api/campaigns \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{
"name":"Test Campaign",
"subject":"Hello!",
"html_body":"<h1>Welcome</h1>",
"from_email":"campaigns@example.com"
}' | jq -r '.id')
```

# 7. Queue Campaign
```
curl -X POST http://localhost:8080/api/campaigns/$CAMPAIGN/queue \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"contact_list_id":1,"batch_size":100}'
```

# 8. Visualize metrics
```
curl -H "Authorization: Bearer $TOKEN" \
http://localhost:8080/api/campaigns/$CAMPAIGN/metrics
```


🛠️ Troubleshooting
Workers dont process jobs

# Verificar se worker está rodando
```
docker-compose ps | grep worker
```

# Restart workers
```
docker-compose restart worker1 worker2 worker3
```

# Verify logs
```
docker-compose logs -f worker1
```

Redis doesn't work

# Verify if Redis iss up
```
docker-compose exec redis redis-cli ping
```

# Restart Redis

```
docker-compose restart redis
```

Database doesn't connect

# Verify MySQL logs
```
docker-compose logs db
```

# Restart

```
docker-compose restart db
docker-compose exec app php artisan migrate
```

Emails doesn't send

Verify email configuration in .env:
```
docker-compose exec app php artisan tinker
```
# > config('mail.driver')
# > config('mail.from')

# Testing email sending
# > \Illuminate\Support\Facades\Mail::raw('Test', function($msg) {
#     $msg->to('test@example.com');
#   });

# Verify logs
```
tail -f storage/logs/laravel.log | grep -i mail
```

📞 Support
For support, please contact us through one of the following channels:
📧 Email: support@example.com
💬 Discord: [link-do-servidor]
🐛 Issues: GitHub Issues

Considerar para produção
✅ Use .env secreto com senhas fortes
✅ Configure SSL/TLS
✅ Use load balancer
✅ Monitore workers com supervisor
✅ Use backup automático do banco
✅ Configure rate limiting
✅ Use CDN para assets
✅ Implemente CORS corretamente
✅ Use secrets manager para credenciais