# Homelab Deployment Guide

This guide will help you deploy your wedding invitation app on your homelab server with public HTTPS access using **Traefik** and **Let's Encrypt**.

## 🎯 Overview

**Tech Stack:**
- **Traefik v2.10** - Reverse proxy with automatic SSL
- **Let's Encrypt** - Free SSL/TLS certificates
- **Docker & Docker Compose** - Container orchestration

**Features:**
- ✅ Automatic HTTPS with SSL certificates
- ✅ Auto-renewal of certificates
- ✅ HTTP → HTTPS redirect
- ✅ Optional Traefik dashboard
- ✅ Support for www/non-www domains

---

## 📋 Prerequisites

### 1. Domain Name
- Register a domain (e.g., from Namecheap, Cloudflare, Google Domains)
- Point your domain's **A record** to your home's public IP address

**DNS Configuration Example:**
```
Type    Name    Value (Your Public IP)    TTL
A       @       123.45.67.89              300
A       www     123.45.67.89              300
```

**Find your public IP:**
```bash
curl ifconfig.me
```

### 2. Network Configuration

**Port Forwarding** (configure on your router):
- Port **80** (HTTP) → Your server's local IP
- Port **443** (HTTPS) → Your server's local IP

**Firewall** (on your server):
```bash
# Ubuntu/Debian
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp

# RHEL/CentOS/Fedora
sudo firewall-cmd --permanent --add-port=80/tcp
sudo firewall-cmd --permanent --add-port=443/tcp
sudo firewall-cmd --reload
```

### 3. Dynamic DNS (Optional)

If your ISP changes your IP frequently, use a Dynamic DNS service:
- **Free options:** DuckDNS, No-IP, Dynu
- Install a DDNS client on your server to auto-update DNS records

### 4. Software Requirements
- Docker (v20.10+)
- Docker Compose (v2.0+)

**Install Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```

---

## 🚀 Deployment Steps

### Step 1: Configure Environment Variables

Edit the `.env` file and update the following:

```bash
# REQUIRED: Your domain name (without http/https or www)
DOMAIN=yourwedding.com

# Email for Let's Encrypt notifications (certificate expiry, etc.)
# Edit this in traefik.yml under certificatesResolvers.letsencrypt.acme.email
```

**Update Traefik configuration:**
```bash
nano traefik.yml
```

Find and change:
```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com  # ← CHANGE THIS
```

### Step 2: Build and Start Services

```bash
# Build containers
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f
```

### Step 3: Verify SSL Certificate

Wait 1-2 minutes for Let's Encrypt to issue certificates. Check logs:
```bash
docker-compose logs traefik | grep -i certificate
```

**Expected output:**
```
time="..." level=info msg="Certificate obtained for domain [yourwedding.com www.yourwedding.com]"
```

### Step 4: Test Your Site

1. **Access your site:**
   - `https://yourwedding.com` ✅
   - `https://www.yourwedding.com` ✅
   - `http://yourwedding.com` → Redirects to HTTPS ✅

2. **Check SSL:**
   - Use [SSL Labs Test](https://www.ssllabs.com/ssltest/)
   - Should get **A** rating

3. **Traefik Dashboard** (optional):
   - Access via: `http://YOUR_SERVER_IP:8081/dashboard/`
   - Or secure with HTTPS: `https://traefik.yourwedding.com`

---

## 🔧 Configuration Options

### Enable Traefik Dashboard with HTTPS

The dashboard is already configured in `docker-compose.yml`. It will be accessible at:
- `https://traefik.yourwedding.com`

**Add Basic Authentication** (recommended):

1. Generate password hash:
```bash
# Install htpasswd (if not installed)
sudo apt install apache2-utils

# Generate hash (replace 'password' with your password)
echo $(htpasswd -nb admin password) | sed -e s/\\$/\\$\\$/g
```

2. Uncomment and update in `docker-compose.yml`:
```yaml
- "traefik.http.routers.traefik-dashboard.middlewares=traefik-auth"
- "traefik.http.middlewares.traefik-auth.basicauth.users=admin:$$apr1$$HASHED_PASSWORD"
```

### Use HTTP Challenge Instead of TLS

If you have issues with TLS challenge, use HTTP challenge:

Edit `traefik.yml`:
```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
      # Remove tlsChallenge: {}
```

### Disable www Redirect

Remove these lines from `docker-compose.yml`:
```yaml
- "traefik.http.middlewares.redirect-www.redirectregex.regex=^https://www\\.(.+)"
- "traefik.http.middlewares.redirect-www.redirectregex.replacement=https://$${1}"
- "traefik.http.middlewares.redirect-www.redirectregex.permanent=true"
```

---

## 🐛 Troubleshooting

### Certificate Not Generated

**Check Traefik logs:**
```bash
docker-compose logs traefik | grep -i error
```

**Common issues:**
1. **Ports not forwarded** - Verify router port forwarding
2. **DNS not propagated** - Check with `dig yourwedding.com`
3. **Rate limit** - Let's Encrypt has limits (5 certs/week per domain)

**Test DNS:**
```bash
dig yourwedding.com +short
# Should return your public IP
```

### 502 Bad Gateway

- Backend container not running
- Network issues between containers

**Fix:**
```bash
docker-compose restart backend
docker-compose logs backend
```

### Let's Encrypt Rate Limit

If you hit rate limits during testing, use **staging environment**:

Edit `traefik.yml`:
```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      caServer: https://acme-staging-v02.api.letsencrypt.org/directory
      # ... rest of config
```

**Note:** Staging certificates are not trusted by browsers (you'll see warnings).

### View Certificate Details

```bash
# List certificates
docker exec traefik cat /letsencrypt/acme.json | grep -i domain

# Check certificate expiry
echo | openssl s_client -servername yourwedding.com -connect yourwedding.com:443 2>/dev/null | openssl x509 -noout -dates
```

---

## 🔒 Security Best Practices

### 1. Secure Traefik Dashboard
- Always use HTTPS with basic auth
- Or disable it completely in production:
  ```yaml
  # In traefik.yml
  api:
    dashboard: false
  ```

### 2. Firewall Rules
```bash
# Only allow HTTP/HTTPS
sudo ufw default deny incoming
sudo ufw default allow outgoing
sudo ufw allow 22/tcp  # SSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw enable
```

### 3. Keep Software Updated
```bash
# Update Docker images regularly
docker-compose pull
docker-compose up -d

# Update system
sudo apt update && sudo apt upgrade -y
```

### 4. Database Backup
```bash
# Backup database
cp database/guests.db database/guests.db.backup-$(date +%Y%m%d)

# Automate with cron (daily at 2 AM)
crontab -e
# Add: 0 2 * * * cp /path/to/database/guests.db /path/to/backups/guests.db.backup-$(date +\%Y\%m\%d)
```

### 5. Monitor Logs
```bash
# Setup log rotation
docker-compose logs --tail=1000 > logs/app-$(date +%Y%m%d).log
```

---

## 📊 Monitoring & Maintenance

### View Container Status
```bash
docker-compose ps
```

### Resource Usage
```bash
docker stats
```

### Certificate Auto-Renewal

Certificates auto-renew 30 days before expiry. No action needed!

**Verify renewal:**
```bash
# Check certificate expiry
docker exec traefik cat /letsencrypt/acme.json
```

### Restart Services
```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart frontend
docker-compose restart backend
docker-compose restart traefik
```

### Stop Services
```bash
# Stop all (data persists)
docker-compose down

# Stop and remove volumes (⚠️ deletes data)
docker-compose down -v
```

---

## 🌐 Alternative Deployment Options

### Option 1: Cloudflare Tunnel (Zero Trust)

**Benefits:**
- No port forwarding needed
- Hides your home IP
- Free DDoS protection

**Setup:**
```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# Authenticate
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create wedding-app

# Route domain
cloudflared tunnel route dns wedding-app yourwedding.com

# Run tunnel
cloudflared tunnel run wedding-app --url http://localhost:80
```

### Option 2: Nginx Proxy Manager (GUI)

If you prefer a web interface:
```yaml
# docker-compose.yml (replace Traefik)
services:
  nginx-proxy-manager:
    image: 'jc21/nginx-proxy-manager:latest'
    ports:
      - '80:80'
      - '443:443'
      - '81:81'  # Admin UI
    volumes:
      - ./data:/data
      - ./letsencrypt:/etc/letsencrypt
```

**Access:** `http://YOUR_IP:81`
- Default: `admin@example.com` / `changeme`

---

## 📞 Support

### Check Logs
```bash
# All services
docker-compose logs

# Specific service
docker-compose logs traefik
docker-compose logs backend
docker-compose logs frontend

# Follow logs live
docker-compose logs -f
```

### Useful Commands
```bash
# Rebuild after config changes
docker-compose up -d --build

# View Traefik configuration
docker exec traefik cat /traefik.yml

# Test backend API
curl http://localhost:8080/api/health

# Check SSL certificate
curl -vI https://yourwedding.com
```

---

## ✅ Deployment Checklist

- [ ] Domain registered and DNS configured
- [ ] Ports 80 & 443 forwarded on router
- [ ] `.env` file updated with domain
- [ ] `traefik.yml` updated with email
- [ ] Docker and Docker Compose installed
- [ ] Services started: `docker-compose up -d`
- [ ] SSL certificate obtained (check logs)
- [ ] Site accessible via HTTPS
- [ ] HTTP redirects to HTTPS
- [ ] Database backup configured
- [ ] Firewall rules configured

---

## 🎉 You're Live!

Your wedding invitation app is now publicly accessible at:
- **🌐 https://yourwedding.com**

Share the link with your guests and enjoy your special day! 💒✨