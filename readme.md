# Campaign Weaver - Backend

Uma plataforma moderna de **email marketing** com suporte a filas assíncronas, workers distribuídos, Redis caching e integração com MailerSend. Arquitetura escalável em Docker.

## 🎯 Características

- **✅ Laravel 11** - Framework PHP moderno
- **✅ Filas Assíncronas** - Redis com múltiplos workers (mails, default, reports)
- **✅ Workers Distribuídos** - 3 workers especializados com retry/backoff exponencial
- **✅ Redis** - Cache, sessions, queues, rate limiting
- **✅ Horizon Dashboard** - Monitoramento de filas em tempo real
- **✅ Email Marketing** - Integração com MailerSend (SMTP)
- **✅ Autenticação API** - Laravel Sanctum com tokens pessoais
- **✅ Docker Compose** - Setup completo com serviços (PHP, Nginx, MySQL, Redis)
- **✅ Batch Processing** - Envio de campanhas em lotes otimizados
- **✅ Webhooks** - Rastreamento de eventos de email (opens, clicks, bounces)
- **✅ Métricas & Analytics** - Cache de métricas com Redis

## 📋 Requisitos

- **Docker** & **Docker Compose**
- **Composer** (opcional, para instalar deps localmente)
- **PHP 8.2+** (se rodar sem Docker)
- **MySQL 8.0+** ou equivalente
- **Redis 7+**

## 🚀 Quick Start

### 1. Clonar e configurar

```bash
# Clone o repositório
git clone https://github.com/seu-repo/campaign-weaver.git
cd campaign-weaver/laravel-backend
```

# Copiar arquivo de ambiente
cp .env.example .env

# Instalar dependências (se não usar Docker)
composer installPronto! Criei um **README.md profissional e completo** com:

✅ **Seções principais:**
- 🎯 Características
- 📋 Requisitos
- 🚀 Quick Start (4 passos)
- 📁 Estrutura do projeto
- 🔌 Todos os endpoints da API (com exemplos de request/response)
- 🔄 Sistema de filas detalhado
- 💾 Banco de dados
- 🔐 Autenticação
- 📧 Integração MailerSend
- 🗄️ Redis Caching
- 📊 Logs
- 🧪 Exemplos com cURL
- 🛠️ Troubleshooting
- 🚢 Deploy production
# Ver status das filas
docker-compose exec app php artisan queue:metrics



# Monitoramento de Filas
Via Artisan Commands

# Processar jobs manualmente (útil para debug)
```
docker-compose exec app php artisan queue:work redis --queue=mails
```

# Limpar filas (CUIDADO - remove todos jobs)
```
docker-compose exec app php artisan queue:flush redis
```

# Retry de jobs falhados
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

# Build otimizado
```
docker build -t campaign-weaver:latest .
```

# Push para registry
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

Verificar Redis

# Conectar ao Redis
```
docker-compose exec redis redis-cli
```

# Ver todas as chaves
```
KEYS *
```

# Ver uso de memória
```
INFO memory
```

# Flush all (CUIDADO!)
```
FLUSHALL
```

📊 Logs
Visualizar Logs

# Logs do app
```
docker-compose logs -f app
```

# Logs de um worker
```
docker-compose logs -f worker1
```

# Logs de erro
```
docker-compose exec app tail -f storage/logs/laravel.log
```

Configure em .env:
```
LOG_LEVEL=debug  # debug, info, notice, warning, error, critical, alert, emergency
```

Níveis de Log

🧪 Testando a API

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

# 3. Listar campanhas
```
curl -H "Authorization: Bearer $TOKEN" \
http://localhost:8080/api/campaigns
```

# 4. Criar contato lista
```
curl -X POST http://localhost:8080/api/contact-lists \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"name":"My List","description":"Test list"}'
```

# 5. Importar contatos
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

# 6. Criar campanha
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

# 7. Fila campanha
```
curl -X POST http://localhost:8080/api/campaigns/$CAMPAIGN/queue \
-H "Authorization: Bearer $TOKEN" \
-H "Content-Type: application/json" \
-d '{"contact_list_id":1,"batch_size":100}'
```

# 8. Ver métricas
```
curl -H "Authorization: Bearer $TOKEN" \
http://localhost:8080/api/campaigns/$CAMPAIGN/metrics
```


🛠️ Troubleshooting
Workers não processam jobs

# Verificar se worker está rodando
```
docker-compose ps | grep worker
```

# Reiniciar workers
```
docker-compose restart worker1 worker2 worker3
```

# Verificar logs
```
docker-compose logs -f worker1
```

Redis não conecta

# Verificar se Redis está up
```
docker-compose exec redis redis-cli ping
```

# Reiniciar Redis

```
docker-compose restart redis
```

Database não conecta

# Verificar logs MySQL
```
docker-compose logs db
```

# Reiniciar

```
docker-compose restart db
docker-compose exec app php artisan migrate
```

Emails não enviam

Verificar configuração de mail
```
docker-compose exec app php artisan tinker
```
# > config('mail.driver')
# > config('mail.from')

# Testar envio
# > \Illuminate\Support\Facades\Mail::raw('Test', function($msg) {
#     $msg->to('test@example.com');
#   });

# Verificar logs
```
tail -f storage/logs/laravel.log | grep -i mail
```

📞 Suporte
Para dúvidas ou problemas:
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