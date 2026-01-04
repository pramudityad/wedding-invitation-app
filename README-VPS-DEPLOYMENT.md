# VPS Deployment Guide - Hetzner Cloud (Debian)

Complete guide to deploy your wedding invitation app on **Hetzner Cloud** VPS with **Debian OS**, using **Traefik** for automatic HTTPS with **Let's Encrypt** SSL certificates.

> **💡 Optimized for Hetzner Cloud**: This guide provides very detailed, step-by-step instructions specifically for Hetzner Cloud, the best-value VPS provider at **€4.15/month**. While the deployment works with any Debian-based VPS provider, this guide focuses on Hetzner for simplicity and value. See the [Appendix](#-appendix-alternative-vps-providers) for other providers.

## 🎯 Overview

**Deployment Stack:**
- **VPS**: Hetzner Cloud (Debian 12) - €4.15/month starting
- **Traefik v2.10**: Reverse proxy with automatic SSL
- **Let's Encrypt**: Free SSL/TLS certificates
- **Docker & Docker Compose**: Container orchestration

**Features:**
- ✅ Automatic HTTPS with SSL certificates
- ✅ Auto-renewal of certificates (no manual intervention)
- ✅ HTTP → HTTPS redirect
- ✅ Security hardening (SSH, firewall, fail2ban)
- ✅ One-command deployment automation
- ✅ Production-ready configuration
- ✅ Easy server scaling (upgrade/downgrade with minimal downtime)

**Why Hetzner Cloud?**
- 🏆 **Best value**: €4.15/month (cheapest reliable option)
- 🌍 **EU servers**: GDPR-compliant, excellent European latency
- ⚡ **Fast setup**: Simple, intuitive console
- 📈 **Easy scaling**: One-click server resize (2-3 minutes downtime)
- 🔒 **Reliable**: 99.9% uptime, established provider since 1997

---

## 📋 Prerequisites

### 1. Hetzner Cloud Account

You'll need a Hetzner Cloud account to follow this guide. See the [Hetzner Cloud Setup](#-hetzner-cloud-setup-detailed) section below for detailed account creation steps.

**Account requirements:**
- Email address for account verification
- Payment method (credit card or PayPal)
- No upfront payment needed - you're only charged for resources you use

**Hetzner Server Plans (Debian 12):**

| Plan | vCPUs | RAM | Storage | Network | Price/Month | Best For |
|------|-------|-----|---------|---------|-------------|----------|
| **CX11** ⭐ | 1 | 2GB | 20GB SSD | 20TB | **€4.15** | Small wedding (<100 guests) |
| **CX22** ✅ | 2 | 4GB | 40GB SSD | 20TB | **€4.92** | Medium wedding (100-500 guests) - Recommended |
| **CX32** | 2 | 8GB | 80GB SSD | 20TB | **€9.35** | Large wedding (500-2000 guests) |
| **CPX11** | 3 | 2GB | 40GB SSD | 20TB | **€5.46** | High CPU, moderate traffic |
| **CPX21** | 3 | 4GB | 80GB SSD | 20TB | **€10.17** | High performance |

**Minimum Specs (General):**
- **RAM**: 2GB (1GB may work but not recommended)
- **CPU**: 1 vCore
- **Storage**: 20GB SSD
- **OS**: Debian 12 (Bookworm) or Debian 11 (Bullseye)
- **Network**: Public IPv4 address

> **💡 Recommendation**: Start with **CX22** (€4.92/month) for the best balance. You can easily upgrade or downgrade later with just 2-3 minutes of downtime. The CX11 works but may struggle with high traffic during your event.

**Alternative VPS Providers**: See [Appendix](#-appendix-alternative-vps-providers) for DigitalOcean, Linode, Vultr, and Oracle Cloud options.

### 2. Domain Name

- Register a domain from: Namecheap, Cloudflare, Porkbun, etc.
- **Cost**: ~$10-15/year

### 3. Local Machine Requirements

- SSH client (built-in on Linux/Mac, use PuTTY on Windows)
- Git (optional, for repository cloning)

---

## 🚀 Quick Start (Hetzner)

**Prerequisites**: Complete the [Hetzner Cloud Setup](#-hetzner-cloud-setup-detailed) section below to create your server and configure DNS first.

Once your **Hetzner server is running** and **DNS is configured**:

```bash
# Step 1: Connect to your Hetzner server
ssh root@YOUR_HETZNER_IP  # Replace with your actual IP (e.g., 78.46.123.45)

# Step 2: Run automated server hardening (as root)
curl -O https://raw.githubusercontent.com/yourusername/wedding-invitation-app/main/scripts/server-setup.sh
sudo bash server-setup.sh

# Step 3: Log out and back in as deploy user
exit
ssh deploy@YOUR_HETZNER_IP

# Step 4: Install Docker (as deploy user)
curl -fsSL https://get.docker.com | sh
sudo usermod -aG docker $USER

# Step 5: Log out and back in for Docker group
exit
ssh deploy@YOUR_HETZNER_IP

# Step 6: Clone repository
git clone https://github.com/yourusername/wedding-invitation-app.git
cd wedding-invitation-app

# Step 7: Configure environment
cp .env.example .env
nano .env  # Edit DOMAIN, secrets, and wedding details

# Step 8: Deploy!
chmod +x deploy.sh
./deploy.sh
```

**That's it!** Your app is now live at `https://yourdomain.com` 🎉

**Time estimate**: ~30-45 minutes total (including Hetzner account setup)

**Detailed instructions**: See sections below for step-by-step guidance with exact Hetzner console navigation.

---

## 🏢 Hetzner Cloud Setup (Detailed)

Follow these detailed steps to create your Hetzner Cloud account and server. Each step includes exact button names and console navigation.

### Create Hetzner Account

1. **Visit Hetzner Cloud website**: Go to https://www.hetzner.com/cloud
2. **Click "Sign Up"** button (top-right corner)
3. **Fill in registration form**:
   - Email address
   - Password (min. 8 characters)
   - Click "Create Account"
4. **Verify your email**: Check your inbox for verification email from Hetzner
5. **Click verification link** in the email
6. **Add payment method**:
   - Log in to https://console.hetzner.cloud
   - Go to your account settings (top-right user icon → "Billing")
   - Add credit card or PayPal
   - Note: No charge until you create resources

### Create a Cloud Project

1. **Log in to Hetzner Cloud Console**: https://console.hetzner.cloud
2. **Create new project**:
   - Click "**+ New Project**" button (or you may already have a "Default" project)
   - **Project name**: Enter a name (e.g., "wedding-app-production" or "my-wedding-site")
   - Click "**Add Project**"
3. **Select project**: Click on your project name to enter the project dashboard
4. You'll see an empty dashboard with "**Add Server**" button

### Add SSH Key (Recommended - Before Creating Server)

Setting up SSH keys now will make server access more secure and convenient.

1. **Navigate to SSH Keys**:
   - In the left sidebar, click "**Security**"
   - Click "**SSH Keys**" tab
   - Click "**Add SSH Key**" button

2. **Generate SSH key on your local machine** (if you don't have one):

   **On Linux/Mac:**
   ```bash
   # Generate new ED25519 key (most secure)
   ssh-keygen -t ed25519 -C "your-email@example.com"

   # Press Enter to save in default location (~/.ssh/id_ed25519)
   # Enter passphrase (optional but recommended)

   # Display your public key
   cat ~/.ssh/id_ed25519.pub
   ```

   **On Windows (PowerShell):**
   ```powershell
   # Generate key
   ssh-keygen -t ed25519 -C "your-email@example.com"

   # Display public key
   type $env:USERPROFILE\.ssh\id_ed25519.pub
   ```

3. **Copy the public key**:
   - Copy the entire output (starts with `ssh-ed25519 AAAA...`)
   - Do NOT copy the private key (the file without `.pub`)

4. **Add key to Hetzner**:
   - Paste the public key into the "**Public key**" text field
   - **Name**: Give it a descriptive name (e.g., "my-laptop", "john-macbook")
   - Click "**Add SSH Key**"
   - You'll see your key listed with a fingerprint

### Create Hetzner Cloud Server

Now let's create your actual server. Follow each step carefully.

1. **Start server creation**:
   - Click "**Add Server**" button (big orange button in the center or top-right)

2. **Select Location** (Step 1/6):
   - **Choose closest to your guests** for best latency:
     - 🇩🇪 **Nuremberg (nbg1)** - Germany, Central Europe
     - 🇩🇪 **Falkenstein (fsn1)** - Germany, Central Europe
     - 🇫🇮 **Helsinki (hel1)** - Finland, Northern Europe
     - 🇺🇸 **Ashburn (ash)** - USA, East Coast
     - 🇺🇸 **Hillsboro (hil)** - USA, West Coast
   - For most European weddings: Choose **Nuremberg** or **Falkenstein**
   - Click on your chosen location

3. **Select Image** (Step 2/6):
   - Click "**Debian**" under "**Images**"
   - Select "**Debian 12**" (latest stable version, Bookworm)
   - Do NOT select Docker, Apps, or Snapshots

4. **Select Type** (Step 3/6):
   - Click "**Shared vCPU**" tab (default, most cost-effective)
   - **Choose your plan**:
     - **CX11** (€4.15/mo): Budget option, may struggle with high traffic
     - **CX22** (€4.92/mo): ✅ **RECOMMENDED** - Best balance
     - **CX32** (€9.35/mo): Large wedding with 500+ expected concurrent guests
     - **CPX11** (€5.46/mo): More CPU power, good for complex operations
   - Click on your chosen plan (it will highlight in blue)

5. **Networking** (Step 4/6):
   - **IPv4**: ✅ Enabled (required - leave checked)
   - **IPv6**: ⬜ Optional (can leave unchecked unless you need it)
   - **Primary IPs**: Leave as "Auto" (default)

6. **SSH Keys** (Step 5/6):
   - ✅ **Select the SSH key** you added earlier (click the checkbox)
   - If you skipped SSH key setup: leave unchecked (you'll get root password via email)
   - You can add multiple keys if needed

7. **Firewalls** (Optional):
   - **Skip for now** - we'll use UFW (Uncomplicated Firewall) inside the server
   - Advanced users: Can create Hetzner Cloud Firewall here for extra security layer

8. **Backups** (Optional but recommended):
   - **Enable automated backups**: ⬜ (costs +€1.97/month for CX22)
   - Backups run weekly and keep last 7 backups
   - Recommended for production, optional for testing
   - You can enable this later if needed

9. **Volumes** (Skip):
   - **Do not add volumes** - not needed for this app (uses SQLite with local storage)

10. **Placement Groups** (Skip):
    - Leave as "No placement group"

11. **Labels** (Optional):
    - Add labels for organization (optional):
      - Key: `environment`, Value: `production`
      - Key: `app`, Value: `wedding`
      - Key: `purpose`, Value: `wedding-invitation`
    - Click "**+ Add label**" to add more

12. **Cloud config** (Skip):
    - Leave "**Cloud config**" field empty
    - This is for advanced automation (not needed)

13. **Name** (Step 6/6):
    - **Server name**: Enter a descriptive name
    - Examples: `wedding-app-prod`, `my-wedding-server`, `wedding-april-2026`
    - This is just for your reference in the Hetzner console

14. **Create the server**:
    - Review the right sidebar showing monthly cost
    - Click "**Create & Buy now**" button (bottom-right)

15. **Server provisioning**:
    - Wait ~30-45 seconds while server is created
    - You'll see a progress indicator
    - Server status will change from "Initializing" → "Running" (green)

### Get Server IP Address

1. **View server details**:
   - Your server now appears in the servers list
   - You'll see:
     - **Server name** (e.g., "wedding-app-prod")
     - **Status**: "Running" (green dot)
     - **IPv4 address**: e.g., `78.46.123.45` or `168.119.x.x`
     - **Location**: e.g., "Nuremberg"

2. **Copy the IPv4 address**:
   - Click on the IPv4 address to copy it
   - Or click on server name → IP address is shown in the overview tab
   - **Write this down** - you'll need it for DNS configuration

3. **Note the root password** (if you didn't use SSH keys):
   - Check your email for "Hetzner Cloud Server Access Details"
   - Email contains root password
   - Save this password securely

### Optional: Configure Hetzner Cloud Firewall (Additional Security Layer)

This is optional - the deploy script configures UFW firewall inside the server. Hetzner Cloud Firewall adds an extra layer at the network level.

1. **Navigate to Firewalls**:
   - In left sidebar, click "**Firewalls**"
   - Click "**Create Firewall**" button

2. **Configure firewall**:
   - **Name**: `wedding-app-firewall`
   - **Inbound Rules**: Click "**Add rule**" for each:
     - **SSH**: Protocol TCP, Port 22, Source `0.0.0.0/0` (any IPv4), `::/0` (any IPv6)
     - **HTTP**: Protocol TCP, Port 80, Source `0.0.0.0/0`, `::/0`
     - **HTTPS**: Protocol TCP, Port 443, Source `0.0.0.0/0`, `::/0`
   - **Outbound Rules**: Leave as "Allow all" (default)

3. **Apply to server**:
   - Scroll down to "**Apply To**" section
   - **Resources**: Click "**Add resource**"
   - Select "**Label Selector**" or "**Server**"
   - Choose your wedding server
   - Click "**Create Firewall**"

4. **Verify**:
   - Go back to your server
   - "**Firewalls**" tab should show your firewall attached

---

## 📝 Detailed Step-by-Step Guide

Now that your Hetzner server is running, you need to point your domain name to it.

### Step 1: Configure DNS (Point Domain to Your Server)

You need to configure DNS records to point your domain to your Hetzner server's IP address.

#### Option A: Using Hetzner DNS (If Domain Registered with Hetzner)

If you registered your domain through Hetzner:

1. **Go to Hetzner DNS Console**: https://dns.hetzner.com/
2. **Select your domain** from the list
3. **Add A records**:
   - Click "**Add record**"
   - **Type**: `A`
   - **Name**: `@` (represents your root domain)
   - **Value**: Your server's IPv4 address (e.g., `78.46.123.45`)
   - **TTL**: `300` (5 minutes)
   - Click "**Create**"

4. **Add www subdomain**:
   - Click "**Add record**" again
   - **Type**: `A`
   - **Name**: `www`
   - **Value**: Same server IP (e.g., `78.46.123.45`)
   - **TTL**: `300`
   - Click "**Create**"

#### Option B: Using External DNS Provider (Cloudflare, Namecheap, etc.)

If your domain is registered elsewhere:

1. **Log in to your domain registrar** (Namecheap, Cloudflare, GoDaddy, etc.)
2. **Navigate to DNS settings**:
   - Namecheap: Domain List → Manage → Advanced DNS
   - Cloudflare: Select domain → DNS → Records
   - GoDaddy: My Products → Domain → DNS → Manage DNS
   - Porkbun: Domain Management → DNS

3. **Add/Edit A records**:

   **For Cloudflare:**
   - Click "**Add record**"
   - **Type**: `A`
   - **Name**: `@`
   - **IPv4 address**: Your Hetzner server IP (e.g., `78.46.123.45`)
   - **Proxy status**: ⬜ DNS only (disable proxy for initial setup)
   - **TTL**: Auto
   - Click "**Save**"

   **For Namecheap:**
   - **Type**: `A Record`
   - **Host**: `@`
   - **Value**: Your server IP
   - **TTL**: `300`

   **For other providers:**
   ```
   Type    Host/Name    Value/Points to       TTL
   A       @            78.46.123.45         300
   A       www          78.46.123.45         300
   ```

4. **Delete any conflicting records**:
   - Remove any existing A records pointing to old IPs
   - Remove AAAA records if you're not using IPv6

#### Verify DNS Configuration

**Wait for DNS propagation** (5-10 minutes, sometimes up to 48 hours):

```bash
# Check if DNS is pointing to your Hetzner server
dig yourdomain.com +short

# Expected output: 78.46.123.45 (your Hetzner server IP)

# Check www subdomain
dig www.yourdomain.com +short

# Also should return: 78.46.123.45
```

**Alternative verification** (if `dig` not available):
```bash
# Using nslookup
nslookup yourdomain.com

# Using ping
ping yourdomain.com
# Should show your Hetzner IP
```

**Online DNS checker**: Visit https://dnschecker.org/
- Enter your domain
- Check that IP matches your Hetzner server
- Verify propagation across different global DNS servers

⚠️ **IMPORTANT**: Do NOT proceed to the next step until DNS is propagated and returning your Hetzner server IP. SSL certificate generation will fail if DNS isn't configured correctly.

---

### Step 2: Initial Server Setup & Hardening

**Connect to your Hetzner server via SSH:**

If you added an SSH key during server creation:
```bash
# Replace with your actual Hetzner server IP
ssh root@78.46.123.45
```

If you didn't add an SSH key (using password):
```bash
# Replace with your actual Hetzner server IP
ssh root@78.46.123.45

# When prompted, enter the root password from the email Hetzner sent you
# Subject: "Hetzner Cloud Server Access Details"
```

**Can't connect via SSH?** Use Hetzner Console (web-based terminal):
1. Go to Hetzner Cloud Console: https://console.hetzner.cloud
2. Click on your server name
3. Click "**Console**" tab (top navigation)
4. Click "**Launch Console**" button
5. Log in as `root` with the password from email
6. You now have terminal access through your browser

**Run the automated hardening script:**
```bash
# Option 1: If you have the files on the server already
cd /root/wedding-invitation-app
sudo bash scripts/server-setup.sh

# Option 2: Download and run directly
curl -O https://raw.githubusercontent.com/yourusername/wedding-invitation-app/main/scripts/server-setup.sh
sudo bash server-setup.sh
```

**What this script does:**
- ✓ Updates system packages
- ✓ Creates non-root user (e.g., `deploy`)
- ✓ Sets up SSH key authentication
- ✓ Disables root login
- ✓ Configures UFW firewall (ports 22, 80, 443)
- ✓ Installs fail2ban (brute-force protection)
- ✓ Enables automatic security updates
- ✓ Creates 2GB swap file

**⚠️ IMPORTANT**: After the script completes:
1. **Test SSH login** as the new user in a **NEW terminal** (don't close root session yet):
   ```bash
   # Replace with your Hetzner server IP
   ssh deploy@78.46.123.45
   ```
2. **Verify sudo access**:
   ```bash
   sudo whoami  # Should output: root
   ```
3. **Only after confirming**, close the root SSH session from the first terminal

---

### Step 3: Install Docker

**Log in as the deploy user** (or continue from the test above):
```bash
# Replace with your Hetzner server IP
ssh deploy@78.46.123.45
```

**Install Docker:**
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
```

**Add user to Docker group:**
```bash
sudo usermod -aG docker $USER
```

**Log out and back in** for group changes to take effect:
```bash
exit
# Replace with your Hetzner server IP
ssh deploy@78.46.123.45
```

**Verify Docker installation:**
```bash
docker --version
docker-compose --version
docker ps  # Should work without sudo
```

---

### Step 4: Deploy the Application

**Option A: Clone from Git Repository (Recommended)**
```bash
# Clone your repository (replace with your actual repo URL)
git clone https://github.com/yourusername/wedding-invitation-app.git
cd wedding-invitation-app
```

**Option B: Transfer Files via SCP**
```bash
# From your local machine (replace with your Hetzner server IP)
scp -r /path/to/wedding-invitation-app deploy@78.46.123.45:~/
```

**Configure environment variables:**
```bash
# Copy example file
cp .env.example .env

# Edit configuration
nano .env
```

**Required changes in `.env`:**
```bash
# Your actual domain
DOMAIN=yourdomain.com

# Generate strong secrets
JWT_SECRET=$(openssl rand -base64 32)
ADMIN_API_KEY=$(openssl rand -hex 32)

# Your email for Let's Encrypt
LETSENCRYPT_EMAIL=your-email@example.com

# Update Spotify credentials (if using)
SPOTIFY_CLIENT_ID=your_actual_client_id
SPOTIFY_CLIENT_SECRET=your_actual_client_secret

# Update wedding details
VITE_APP_WEDDING_DATE=2026-04-05T17:00:00
VITE_PARTNER1_ACCOUNT_NAME="Your Name"
# ... etc
```

**Update Traefik email:**
```bash
nano traefik.yml
# Find line 33 and change:
# email: your-email@example.com
```

**Run the automated deployment script:**
```bash
chmod +x deploy.sh
./deploy.sh
```

**The script will:**
1. ✓ Validate Docker installation
2. ✓ Check `.env` configuration
3. ✓ Verify DNS settings
4. ✓ Create required directories
5. ✓ Build Docker images
6. ✓ Start containers
7. ✓ Wait for SSL certificate
8. ✓ Display access information

### Step 6: Verify Deployment

**1. Check container status:**
```bash
docker-compose ps
```

Expected output:
```
NAME      IMAGE                        STATUS      PORTS
traefik   traefik:v2.10               Up          0.0.0.0:80->80/tcp, 0.0.0.0:443->443/tcp
backend   wedding-invitation-backend  Up
frontend  wedding-invitation-frontend Up
```

✅ All containers should show "Up" status (not "Restarting" or "Exited")

**2. View logs (check for errors):**
```bash
# All services
docker-compose logs -f

# Specific service
docker-compose logs -f traefik
docker-compose logs -f backend

# Check for SSL certificate success
docker-compose logs traefik | grep -i certificate
```

✅ Traefik logs should show: "Certificate obtained for domain yourdomain.com"

**3. Check Hetzner Console Metrics:**

Verify your server resources are healthy in Hetzner Cloud Console:

1. **Open Hetzner Console**: https://console.hetzner.cloud
2. **Navigate to your server**: Projects → Your Project → Your Server
3. **Click "Graphs" tab** (top navigation)
4. **Verify metrics**:
   - **CPU usage**: Should be <30% for idle app, <70% during traffic
   - **Network traffic**: Should show inbound/outbound activity after deployment
   - **Disk I/O**: Should show some activity

**Expected Hetzner graphs after deployment**:
- CPU: Small spike during Docker build, then low (<20%)
- Network In: Moderate activity (Docker pulls, package downloads)
- Network Out: Minimal
- Disk I/O: Brief spike during build, then quiet

**4. Test your website:**

**Basic tests:**
1. **HTTP redirect**: `http://yourdomain.com` → should redirect to HTTPS ✅
2. **Main site**: `https://yourdomain.com` → should load with valid SSL lock icon ✅
3. **WWW redirect**: `https://www.yourdomain.com` → should redirect to non-www ✅
4. **SSL certificate**: Click padlock in browser → should show:
   - "Connection is secure"
   - Issued by: Let's Encrypt
   - Valid for: yourdomain.com

**Functional tests:**
5. **RSVP form**: Try submitting an RSVP → should work without errors
6. **Comments**: Post a test comment → should appear immediately
7. **Mobile**: Test on phone → should be responsive

**5. Check resource usage:**
```bash
# Memory usage (should have plenty free)
free -h

# Docker container resources
docker stats --no-stream

# Disk usage (should be well under limit)
df -h
```

**Expected resource usage (CX22 - 4GB RAM)**:
- Memory: ~1-2GB used out of 4GB (plenty of headroom)
- Containers: Each using 50-200MB RAM
- Disk: ~5-10GB used out of 40GB

**6. Check SSL rating (optional but recommended):**
- Visit: https://www.ssllabs.com/ssltest/
- Enter your domain: `yourdomain.com`
- Wait for analysis (~2 minutes)
- **Expected grade**: **A** or **A+** 🎯

**7. Verify in Hetzner Console (Server Overview):**

Go back to Hetzner Console → Your Server → "Overview" tab:
- **Status**: "Running" (green dot) ✅
- **IPv4**: Should match your DNS configuration ✅
- **Load**: Should be low (<1.0 on CX11/CX22) ✅

**Troubleshooting verification issues:**

| Issue | Check | Solution |
|-------|-------|----------|
| Containers won't start | `docker-compose logs` | Check .env configuration |
| SSL not working | DNS propagation | Wait 5-10 min, verify with `dig yourdomain.com` |
| High CPU in Hetzner | `docker stats` | Normal during build, should drop after |
| Out of memory | `free -h` | Consider upgrading to CX22 or CX32 |
| Can't access site | Firewall | Check UFW: `sudo ufw status` |

**All checks passed?** 🎉 Your wedding invitation is live and ready to share with guests!

---

## 🔧 Configuration & Customization

### Traefik Dashboard Access

**Option 1: Via IP (Unsecured)**
```
http://YOUR_VPS_IP:8081/dashboard/
```

**Option 2: Via Domain with HTTPS (Recommended)**

Already configured at: `https://traefik.yourdomain.com`

**Add Basic Authentication** (highly recommended):
```bash
# Generate password hash
sudo apt install apache2-utils
echo $(htpasswd -nb admin yourpassword) | sed -e s/\\$/\\$\\$/g
```

Edit `docker-compose.yml` and uncomment:
```yaml
- "traefik.http.routers.traefik-dashboard.middlewares=traefik-auth"
- "traefik.http.middlewares.traefik-auth.basicauth.users=admin:$$apr1$$HASH_HERE"
```

Restart Traefik:
```bash
docker-compose restart traefik
```

### Use HTTP Challenge Instead of TLS

If you have issues with TLS challenge (some VPS providers block it), use HTTP challenge:

Edit `traefik.yml`:
```yaml
certificatesResolvers:
  letsencrypt:
    acme:
      email: your-email@example.com
      storage: /letsencrypt/acme.json
      httpChallenge:
        entryPoint: web
      # Remove: tlsChallenge: {}
```

Restart:
```bash
docker-compose restart traefik
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
docker-compose logs traefik | grep -i certificate
```

**Common issues:**

1. **DNS not pointing to server**
   ```bash
   # Check DNS
   dig yourdomain.com +short
   # Should match your VPS IP
   curl ifconfig.me
   ```

2. **Firewall blocking ports**
   ```bash
   sudo ufw status
   # Should show: 80/tcp ALLOW, 443/tcp ALLOW
   ```

3. **Let's Encrypt rate limit** (5 certificates per week per domain)
   - **Solution**: Use staging environment for testing
   ```yaml
   # In traefik.yml
   certificatesResolvers:
     letsencrypt:
       acme:
         caServer: https://acme-staging-v02.api.letsencrypt.org/directory
   ```
   Note: Staging certs are not trusted by browsers

### 502 Bad Gateway

**Backend container not running:**
```bash
docker-compose ps
docker-compose logs backend
docker-compose restart backend
```

### Port Already in Use

**Check what's using ports 80/443:**
```bash
sudo netstat -tlnp | grep ':80\|:443'
```

**Stop conflicting services:**
```bash
# If Apache is running
sudo systemctl stop apache2
sudo systemctl disable apache2

# If Nginx is running
sudo systemctl stop nginx
sudo systemctl disable nginx
```

### Out of Memory

**Check memory usage:**
```bash
free -h
docker stats
```

**Restart containers to free memory:**
```bash
docker-compose restart
```

**Increase swap (if needed):**
```bash
sudo swapoff /swapfile
sudo dd if=/dev/zero of=/swapfile bs=1M count=4096  # 4GB
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
```

### Hetzner Cloud Console Issues

Quick fixes for common Hetzner-specific problems:

**Can't SSH into server:**
- **Check server status**: Hetzner Console → Your Server → Status should show "Running" (green)
- **Verify IP**: Ensure you're using the IPv4 address shown in Hetzner Console
- **Emergency access**: Server page → "**Console**" tab → "**Launch Console**" for web-based terminal
- **Password reset**: Server page → "**Rescue**" tab → Enable rescue mode → Reboot → Access with temporary password

**Firewall blocking ports (Hetzner Cloud Firewall):**
- **Check**: Hetzner Console → "**Firewalls**" → See if firewall is applied to your server
- **If yes**: Edit firewall → Ensure ports 22, 80, 443 allow source `0.0.0.0/0`
- **If no firewall**: Issue is with UFW inside server (see generic troubleshooting above)

**Server stuck or won't start:**
- **Power cycle**: Server page → "**Power**" dropdown → "**Power cycle**"
- **Check graphs**: "**Graphs**" tab shows if server is actually responsive
- **Rescue mode**: "**Rescue**" tab → Enable → Reboot → Access via SSH to diagnose

**Out of disk space (especially CX11 with 20GB only):**
```bash
df -h  # Check current usage
docker system prune -a  # Can free 2-5GB

# If still full:
# Option 1: Upgrade to CX22 (40GB) - see "Scaling & Upgrades" section below
# Option 2: Attach Hetzner Volume: Console → Volumes → Create Volume (€0.56/10GB/month)
```

**Note**: For non-Hetzner issues (SSL certificates, DNS propagation, Docker problems), see the sections above.

---

## 🔒 Security Best Practices

### 1. Use SSH Keys (Not Passwords)

**Generate SSH key on your local machine:**
```bash
ssh-keygen -t ed25519 -C "your-email@example.com"
```

**Copy to server:**
```bash
ssh-copy-id deploy@123.45.67.89
```

**Disable password authentication:**
```bash
sudo nano /etc/ssh/sshd_config
# Set: PasswordAuthentication no
sudo systemctl restart sshd
```

### 2. Keep System Updated

**Manual updates:**
```bash
sudo apt update && sudo apt upgrade -y
```

**Automatic security updates are already enabled** by the setup script via `unattended-upgrades`.

### 3. Monitor Fail2ban

**Check banned IPs:**
```bash
sudo fail2ban-client status sshd
```

**Unban an IP:**
```bash
sudo fail2ban-client set sshd unbanip 1.2.3.4
```

### 4. Regular Backups

**Database backup script:**
```bash
#!/bin/bash
# Save as: ~/backup-database.sh
BACKUP_DIR="$HOME/backups"
mkdir -p "$BACKUP_DIR"
cd ~/wedding-invitation-app
cp database/guests.db "$BACKUP_DIR/guests-$(date +%Y%m%d-%H%M%S).db"

# Keep only last 7 days of backups
find "$BACKUP_DIR" -name "guests-*.db" -mtime +7 -delete
```

**Make executable:**
```bash
chmod +x ~/backup-database.sh
```

**Automate with cron (daily at 2 AM):**
```bash
crontab -e
# Add:
0 2 * * * /home/deploy/backup-database.sh
```

**Backup to remote storage (optional):**
```bash
# Install rclone
curl https://rclone.org/install.sh | sudo bash

# Configure (e.g., Google Drive, Dropbox)
rclone config

# Copy backups
rclone copy ~/backups remote:wedding-backups
```

### 5. Monitor Disk Space

**Check disk usage:**
```bash
df -h
```

**Clean Docker:**
```bash
# Remove unused images
docker image prune -a

# Remove unused volumes
docker volume prune

# Full cleanup
docker system prune -a --volumes
```

### 6. Change Default SSH Port (Optional)

**Edit SSH config:**
```bash
sudo nano /etc/ssh/sshd_config
# Change: Port 22 → Port 2222
sudo systemctl restart sshd
```

**Update firewall:**
```bash
sudo ufw allow 2222/tcp
sudo ufw delete allow 22/tcp
```

**Update docker-compose.yml** if using alternative port.

---

## 💾 Hetzner Backups & Snapshots

Hetzner provides two backup solutions plus the application's built-in database backup script.

### Automated Backups (Recommended for Production)

Hetzner's automated backup system creates weekly backups of your entire server.

**Enable Automated Backups:**
1. Go to Hetzner Cloud Console: https://console.hetzner.cloud
2. Click on your server name
3. Click "**Backups**" tab (top navigation)
4. Click "**Enable Backups**" button
5. **Confirm cost**: ~40% of server price
   - CX11: +€1.66/month
   - CX22: +€1.97/month
   - CX32: +€3.74/month
6. Click "**Enable backups**"

**How it works:**
- **Frequency**: Automatic weekly backups
- **Retention**: Last 7 backups are kept
- **Creation time**: Between 1 AM - 5 AM server time (configurable)
- **Includes**: Entire server disk image
- **Recovery**: One-click restore

**Restore from Automated Backup:**
1. Hetzner Console → Your Server → "**Backups**" tab
2. Select backup by date
3. Click "**Restore**" button
4. Confirm (⚠️ will overwrite current server!)
5. Server will restart with backup data

### Manual Snapshots (For Major Changes)

Create snapshots before major updates or configuration changes.

**Create a Snapshot:**
1. Hetzner Console → Your Server
2. Click "**Snapshots**" tab
3. Click "**Take Snapshot**" button
4. **Name**: Descriptive name (e.g., `before-upgrade-to-cx22`, `pre-v2-deployment`)
5. Click "**Create Snapshot**"
6. Wait 1-3 minutes for snapshot creation

**Cost:** €0.0119/GB/month (charged per GB of disk usage)
- CX11 snapshot (20GB): ~€0.24/month
- CX22 snapshot (40GB): ~€0.48/month

**Restore from Snapshot:**
1. **Option A - Rebuild existing server**:
   - Server page → "**Snapshots**" tab
   - Select snapshot
   - Click "**Rebuild**" (⚠️ destroys current server)

2. **Option B - Create new server from snapshot** (safer):
   - Hetzner Console → "**Add Server**"
   - Images tab → "**Snapshots**"
   - Select your snapshot
   - Choose server type (can be different from original)
   - Create server (old server remains untouched)

**Best Practice:**
- Create snapshot BEFORE major changes:
  ```bash
  # Before upgrade or deployment
  # Create snapshot via Hetzner Console
  # Then proceed with changes
  ```
- Delete old snapshots to save costs (€0.0119/GB/month adds up)

### Database Backups (Already Configured)

The application includes a database backup script.

**Script location:** `~/backup-database.sh` (created by setup script)

**What it does:**
- Backs up SQLite database (`database/guests.db`)
- Stores in `~/backups/` directory
- Keeps last 7 days of backups
- Runs automatically via cron at 2 AM daily

**Manual backup:**
```bash
# Run backup script manually
~/backup-database.sh

# Or copy database directly
cp database/guests.db ~/backups/guests-$(date +%Y%m%d).db
```

**Restore from database backup:**
```bash
# Stop containers
docker-compose down

# Restore specific backup
cp ~/backups/guests-20260305-020000.db database/guests.db

# Restart
docker-compose up -d
```

**Download backups to local machine:**
```bash
# From your local machine (replace with your Hetzner IP)
scp -r deploy@78.46.123.45:~/backups/ ./wedding-backups/
```

### Backup to Remote Storage (Optional)

For extra safety, backup to cloud storage.

**Install rclone:**
```bash
curl https://rclone.org/install.sh | sudo bash
```

**Configure remote (Google Drive, Dropbox, S3, etc.):**
```bash
rclone config
# Follow interactive setup
```

**Add to backup script:**
```bash
# Edit backup script
nano ~/backup-database.sh

# Add at end:
# rclone copy ~/backups/ remote:wedding-backups/
```

**Automated cloud backup via cron:**
```bash
crontab -e
# Add:
0 3 * * * /usr/bin/rclone copy ~/backups/ remote:wedding-backups/ --max-age 7d
```

### Backup Strategy Recommendation

**For production wedding app:**
1. ✅ **Enable Hetzner Automated Backups** (+€1.97/month for CX22)
   - Weekly full server backups
   - Easy recovery from disasters
2. ✅ **Create snapshot before major changes**
   - Before upgrading server
   - Before deploying new version
   - Delete after confirming stability
3. ✅ **Use database backup script** (already configured)
   - Daily backups of guest data
   - Cron runs at 2 AM
4. ⬜ **Cloud backup** (optional)
   - Extra safety if paranoid
   - Costs vary by provider

**Minimum for testing:**
- Database backup script only (free, already included)
- Create manual snapshot before major changes

---

## 📊 Monitoring & Maintenance

### View Container Logs

```bash
# Live logs (all services)
docker-compose logs -f

# Last 100 lines (specific service)
docker-compose logs --tail=100 backend

# Search logs
docker-compose logs backend | grep error
```

### Monitor Resource Usage

```bash
# Real-time stats
docker stats

# System resources
htop

# Disk usage
df -h
du -sh ~/wedding-invitation-app/*
```

### Certificate Renewal

Certificates **auto-renew** 30 days before expiry. No action needed!

**Check certificate expiry:**
```bash
docker exec traefik cat /letsencrypt/acme.json | grep -i domain

# Check via OpenSSL
echo | openssl s_client -servername yourdomain.com -connect yourdomain.com:443 2>/dev/null | openssl x509 -noout -dates
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart traefik

# Rebuild and restart (after code changes)
docker-compose up -d --build
```

### Update Application

```bash
# Pull latest code
git pull

# Rebuild and restart
docker-compose up -d --build

# View logs to verify
docker-compose logs -f
```

### Stop Services

```bash
# Stop all (data persists)
docker-compose down

# Stop and remove volumes (⚠️ DELETES DATA)
docker-compose down -v
```

---

## 📈 Hetzner Server Scaling & Upgrades

One of Hetzner's best features is the ability to easily upgrade or downgrade your server with minimal downtime (2-3 minutes).

### When to Upgrade Your Server

**Signs you need more resources:**
- ❌ High CPU usage (>80% sustained) - check with `htop`
- ❌ Low available memory (swap usage high) - check with `free -h`
- ❌ Slow page loads or API responses
- ❌ Docker containers restarting due to OOM (Out of Memory)
- ❌ Database queries timing out
- ❌ High traffic during wedding event causing slowdowns

**Check current resources:**
```bash
# Memory usage
free -h

# CPU and load average
uptime
htop

# Docker container stats
docker stats --no-stream

# Disk usage
df -h
```

### Upgrade Process (2-3 Minutes Downtime)

**Step 1: Choose New Server Type**

Hetzner upgrade paths (always upgrades within same series):

**CX Series (Shared vCPU - Most Common):**
- **CX11 → CX22**: €4.15 → €4.92/month
  - RAM: 2GB → 4GB (2x)
  - Storage: 20GB → 40GB (2x)
  - vCPUs: 1 → 2
- **CX22 → CX32**: €4.92 → €9.35/month
  - RAM: 4GB → 8GB (2x)
  - Storage: 40GB → 80GB (2x)
  - vCPUs: 2 → 2 (same)
- **CX32 → CX42**: €9.35 → €17.26/month
  - RAM: 8GB → 16GB (2x)
  - Storage: 80GB → 160GB (2x)
  - vCPUs: 2 → 4

**CPX Series (Better CPU Performance):**
- **CPX11** (€5.46/month): 3 vCPUs, 2GB RAM, 40GB
- **CPX21** (€10.17/month): 3 vCPUs, 4GB RAM, 80GB
- **CPX31** (€18.67/month): 4 vCPUs, 8GB RAM, 160GB

**Note**: You can only upgrade within the same series (CX→CX or CPX→CPX). To switch series, you must create a new server from a snapshot.

**Step 2: Create Snapshot (Optional but Recommended)**

Before upgrading, create a snapshot in case you need to roll back:

1. **Hetzner Console** → Your Server → "**Snapshots**" tab
2. Click "**Take Snapshot**"
3. Name: `before-upgrade-to-cx22-[date]`
4. Wait ~1-3 minutes for snapshot creation
5. Verify snapshot appears in list

**Step 3: Perform Upgrade in Hetzner Console**

1. **Navigate to your server**:
   - Hetzner Cloud Console → Projects → Your Project
   - Click on your server name

2. **Initiate resize**:
   - Click "**Resize**" button (top navigation or left sidebar under "Actions")
   - **IMPORTANT**: You'll see two options:
     - "**Upgrade**" (increase resources)
     - "**Downgrade**" (decrease resources)
   - Select "**Upgrade**"

3. **Select new server type**:
   - Choose target plan from the list (e.g., CX22)
   - Review:
     - Current plan vs. new plan
     - Price difference (e.g., +€0.77/month)
     - Resources gained
   - Check box: "**I understand that the server will be powered off during the resize**"

4. **Confirm upgrade**:
   - Click "**Resize Server**" button

5. **Automatic process** (watch in real-time):
   - **Server shutdown**: ~10-15 seconds
   - **Disk resizing**: ~1-2 minutes
   - **Resource allocation**: ~30 seconds
   - **Server restart**: ~20-30 seconds
   - **Total downtime**: ~2-3 minutes

6. **Wait for "Running" status**:
   - Server status changes from "Off" → "Starting" → "Running" (green)
   - IP address remains the same (no DNS changes needed)

**Step 4: Verify Upgrade**

Once server shows "Running":

1. **SSH back into server**:
   ```bash
   # Replace with your Hetzner server IP (same as before)
   ssh deploy@78.46.123.45
   ```

2. **Check new resources**:
   ```bash
   # Verify RAM increased
   free -h
   # Should show new total (e.g., 4GB instead of 2GB)

   # Verify disk increased
   df -h
   # Should show larger /dev/sda1 size

   # Check CPU cores
   nproc
   # Should show new vCPU count

   # Verify system info
   lscpu
   cat /proc/meminfo | grep MemTotal
   ```

3. **Verify application is running**:
   ```bash
   # Check all containers are running
   docker-compose ps
   # All should show "Up"

   # Check resource usage
   docker stats --no-stream

   # Check logs for errors
   docker-compose logs --tail=50
   ```

4. **Test website**:
   - Visit `https://yourdomain.com`
   - Verify site loads correctly
   - Test RSVP and comment features

**Step 5: Monitor Performance**

After upgrade, monitor for 24-48 hours:

1. **Check Hetzner Console graphs**:
   - Server page → "**Graphs**" tab
   - View CPU, RAM, Network usage
   - Verify usage is now within comfortable limits (<70%)

2. **Monitor with htop**:
   ```bash
   htop
   # CPU bars should be lower
   # Memory usage % should be significantly reduced
   ```

3. **Check Docker stats**:
   ```bash
   docker stats
   # Container memory % should be lower
   ```

### Downgrade Process (If Needed)

**⚠️ WARNING**: Downgrading only works if your disk usage fits in the smaller server's storage!

**Check if downgrade is possible:**
```bash
df -h
# Look at "Used" column for /dev/sda1

# Example: If using 18GB, can downgrade CX22 (40GB) → CX11 (20GB)
# If using 25GB, CANNOT downgrade to CX11 (only has 20GB)
```

**Downgrade steps** (same process as upgrade):
1. Hetzner Console → Server → "**Resize**"
2. Select "**Downgrade**" option
3. Choose smaller server type
4. Check "I understand..." box
5. Click "**Resize Server**"
6. If disk doesn't fit, you'll get an error message

**Note**: Downgrade also has ~2-3 minutes downtime.

### Emergency Quick-Scaling

**Scenario**: Your wedding is in 2 hours and the server is struggling with traffic!

**Fastest option - Upgrade server type:**
```bash
# Total time: ~5 minutes (including verification)
```

1. **Don't panic** - 2-3 minutes downtime is acceptable
2. **Create snapshot first** (1-2 minutes) - safety net
3. **Upgrade to next tier**:
   - CX11 → CX22 (most common upgrade)
   - CX22 → CX32 (for very high traffic)
4. **Wait for server to restart** (~3 minutes)
5. **Verify app is running** (1 minute)
6. **Monitor performance** - should be stable now

**Alternative quick fixes** (while upgrading):
```bash
# Free up memory immediately
docker-compose restart

# Remove unused Docker images
docker system prune -a -f

# Check what's using resources
htop
docker stats
```

### Cost Comparison After Scaling

Understand the cost implications of different server sizes:

| Configuration | Monthly Cost | Suitable For | Concurrent Users |
|---------------|--------------|--------------|------------------|
| **CX11** (2GB) | €4.15 | Small wedding, testing | <50 concurrent |
| **CX22** (4GB) | €4.92 | Medium wedding | 50-200 concurrent |
| **CX32** (8GB) | €9.35 | Large wedding | 200-500 concurrent |
| **CPX21** (4GB, 3vCPU) | €10.17 | High CPU needs | 100-300 concurrent |
| **CX42** (16GB) | €17.26 | Very large event | 500-1000 concurrent |

**Annual cost savings** by downsizing after wedding:
- Run CX22 (€4.92/mo) during event
- Downgrade to CX11 (€4.15/mo) after wedding
- Savings: €0.77/month × 11 months = €8.47/year

**Recommendation for wedding day**:
- Start with CX22 (recommended tier)
- If you expect >200 concurrent guests, upgrade to CX32 a few days before
- Downgrade to CX11 after event if keeping site online for memories

### Horizontal Scaling (Advanced - Multiple Servers)

**For very large weddings** (>1000 concurrent guests):

**Option 1: Hetzner Load Balancer**
- **Cost**: €5.83/month
- **Setup**: Hetzner Console → Load Balancers → Create
- **Requires**: Multiple backend servers + shared database

**Steps**:
1. Create snapshot of current server
2. Create 2-3 servers from snapshot
3. Set up Hetzner Load Balancer
4. Configure health checks (HTTP port 80)
5. Migrate database to shared Hetzner Volume or separate server

**Note**: This wedding app is designed for single-server deployment. Horizontal scaling requires architecture changes:
- Shared database (SQLite → PostgreSQL)
- Stateless sessions
- Synchronized file uploads
- Not recommended unless absolutely necessary

### Monitoring Scaling Effectiveness

**Before upgrade:**
```bash
# Capture baseline metrics
docker stats --no-stream > before-upgrade.txt
free -h > memory-before.txt
uptime > load-before.txt
```

**After upgrade:**
```bash
# Compare metrics
docker stats --no-stream > after-upgrade.txt
free -h > memory-after.txt
uptime > load-after.txt

# Compare files
diff before-upgrade.txt after-upgrade.txt
```

**Expected improvements after CX11 → CX22 upgrade:**
- Memory usage %: 75% → 35% (cut in half)
- Swap usage: 500MB → 0MB (no swapping)
- Load average: 1.5 → 0.3 (much lower)
- Container restarts: Frequent → None
- Page load time: 3s → 0.5s (faster)

### Scaling Best Practices

✅ **Do:**
- Create snapshot before upgrading
- Upgrade during low-traffic period (or 2-3 min downtime is fine)
- Monitor for 24-48h after upgrade
- Downgrade after event to save costs

❌ **Don't:**
- Upgrade without snapshot (small risk but avoidable)
- Switch between CX/CPX series (requires new server creation)
- Downgrade if disk usage exceeds target size
- Panic - upgrades are quick and reversible

---

## 🔄 CI/CD & Automation (Optional)

### Git-Based Deployment with Webhooks

**1. Install webhook listener:**
```bash
sudo apt install webhook
```

**2. Create webhook script** (`~/webhook-deploy.sh`):
```bash
#!/bin/bash
cd ~/wedding-invitation-app
git pull
docker-compose up -d --build
```

**3. Configure webhook:**
```bash
nano ~/hooks.json
```

```json
[
  {
    "id": "deploy-wedding-app",
    "execute-command": "/home/deploy/webhook-deploy.sh",
    "command-working-directory": "/home/deploy/wedding-invitation-app",
    "response-message": "Deployment triggered"
  }
]
```

**4. Start webhook service:**
```bash
webhook -hooks ~/hooks.json -verbose -port 9000
```

**5. Add webhook to GitHub/GitLab:**
- URL: `http://yourdomain.com:9000/hooks/deploy-wedding-app`
- Content type: `application/json`

### Systemd Service for Webhook (Optional)

```bash
sudo nano /etc/systemd/system/webhook.service
```

```ini
[Unit]
Description=Webhook Service
After=network.target

[Service]
User=deploy
ExecStart=/usr/bin/webhook -hooks /home/deploy/hooks.json -port 9000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable webhook
sudo systemctl start webhook
```

---

## 📈 Performance Optimization

### Enable Gzip Compression

Add to `frontend/nginx.conf`:
```nginx
gzip on;
gzip_vary on;
gzip_min_length 1024;
gzip_types text/plain text/css application/json application/javascript text/xml application/xml text/javascript;
```

### Add Caching Headers

```nginx
location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2)$ {
    expires 1y;
    add_header Cache-Control "public, immutable";
}
```

### Database Optimization

```bash
# Compact SQLite database
sqlite3 database/guests.db "VACUUM;"
```

---

## ✅ Deployment Checklist

### Pre-Deployment
- [ ] VPS created with Debian 12
- [ ] Domain registered
- [ ] DNS A record points to VPS IP
- [ ] SSH access working

### Initial Setup
- [ ] Server hardening script executed
- [ ] Non-root user created
- [ ] SSH key authentication configured
- [ ] Firewall enabled (UFW)
- [ ] Fail2ban installed
- [ ] Docker installed

### Application Deployment
- [ ] Repository cloned/files transferred
- [ ] `.env` configured with domain and secrets
- [ ] `traefik.yml` updated with email
- [ ] `./deploy.sh` executed successfully
- [ ] All containers running

### Verification
- [ ] HTTPS working at `https://yourdomain.com`
- [ ] HTTP redirects to HTTPS
- [ ] SSL certificate valid
- [ ] WWW subdomain working
- [ ] Backend API responding
- [ ] Database accessible

### Security
- [ ] Root login disabled
- [ ] Password authentication disabled
- [ ] Strong JWT_SECRET and ADMIN_API_KEY set
- [ ] Firewall rules verified
- [ ] Fail2ban active
- [ ] Automatic updates enabled

### Maintenance
- [ ] Database backup configured
- [ ] Monitoring setup (logs)
- [ ] Update procedure documented
- [ ] Emergency recovery plan

---

## 🆘 Emergency Recovery

### Restore from Backup

```bash
# Stop containers
docker-compose down

# Restore database
cp ~/backups/guests-YYYYMMDD-HHMMSS.db database/guests.db

# Restart
docker-compose up -d
```

### Full Reinstall

```bash
# Stop and remove everything
docker-compose down -v
docker system prune -a

# Re-run deployment
./deploy.sh
```

### Access Server Console (VPS Provider)

If locked out via SSH, use VPS provider's web console:
- DigitalOcean: Droplet → Console
- Linode: Lish Console
- Vultr: View Console

---

## 💰 Cost Breakdown

Complete cost analysis for running your wedding invitation app on Hetzner Cloud.

### Monthly Hosting Costs (Hetzner)

**Basic Configuration (Minimum):**
| Item | Cost | Notes |
|------|------|-------|
| **Hetzner CX11** (2GB RAM, 20GB SSD) | **€4.15/month** | Entry-level, may struggle with high traffic |
| **Domain name** | ~€0.83/month | (~€10/year from Namecheap, Cloudflare) |
| **SSL Certificate** | FREE | Let's Encrypt (auto-renewed) |
| **Network traffic** | FREE | 20TB included with CX11 |
| **Total** | **~€5/month** | **Minimum viable setup** |

**Recommended Configuration (Production):**
| Item | Cost | Notes |
|------|------|-------|
| **Hetzner CX22** (4GB RAM, 40GB SSD) | **€4.92/month** | Best balance, handles 100-500 guests |
| **Automated Backups** | +€1.97/month | Weekly backups, 7 retained |
| **Domain name** | ~€0.83/month | (~€10/year) |
| **SSL Certificate** | FREE | Let's Encrypt |
| **Total** | **~€7.72/month** | **Recommended for weddings** |

**High-Traffic Configuration (Large Wedding):**
| Item | Cost | Notes |
|------|------|-------|
| **Hetzner CX32** (8GB RAM, 80GB SSD) | **€9.35/month** | For 200-500 concurrent guests |
| **Automated Backups** | +€3.74/month | Weekly backups |
| **Domain name** | ~€0.83/month | (~€10/year) |
| **SSL Certificate** | FREE | Let's Encrypt |
| **Total** | **~€13.92/month** | **For large events** |

### Optional Add-Ons (Hetzner)

| Add-On | Cost | When to Use |
|--------|------|-------------|
| **Snapshots** | €0.0119/GB/month | Before major changes (CX22 = ~€0.48/mo) |
| **Hetzner Cloud Firewall** | FREE | Extra security layer (recommended) |
| **Hetzner Load Balancer** | €5.83/month | Multiple servers (>1000 concurrent users) |
| **Hetzner Volumes** (10GB) | €0.56/month | Additional storage if needed |
| **IPv6** | FREE | Optional, included |

### One-Time Costs

| Item | Cost | Required? |
|------|------|-----------|
| **Domain registration** | €10-15/year | Yes |
| **Setup time** | FREE | ~2-3 hours of your time |

### Annual Cost Estimates

**Scenario 1: Budget Setup (CX11, no backups)**
- Monthly: €4.15 (server) + €0.83 (domain) = **€4.98/month**
- Annual: **€59.76/year** or **€4.98/month**

**Scenario 2: Recommended (CX22 with backups)**
- Monthly: €4.92 (server) + €1.97 (backups) + €0.83 (domain) = **€7.72/month**
- Annual: **€92.64/year** or **€7.72/month**

**Scenario 3: Smart Scaling (upgrade for wedding, downgrade after)**
- Months 1-11: CX11 = €4.15 × 11 = €45.65
- Month 12 (wedding month): CX22 = €4.92
- Backups for wedding month: €1.97
- Domain: €10/year
- Total annual: **€62.54/year** or **€5.21/month average**

**Scenario 4: Large Wedding (CX32 for event)**
- Months 1-10: CX11 = €4.15 × 10 = €41.50
- Month 11 (testing): CX22 = €4.92
- Month 12 (wedding): CX32 = €9.35
- Backups (months 11-12): €1.97 × 2 = €3.94
- Domain: €10/year
- Total annual: **€69.71/year** or **€5.81/month average**

### Cost Comparison: Hetzner vs. Competitors

| Provider | Entry Plan | RAM | Storage | Price/Month | Annual Total* |
|----------|-----------|-----|---------|-------------|---------------|
| **Hetzner CX11** 🏆 | CX11 | 2GB | 20GB | €4.15 | **€59.76** |
| **Hetzner CX22** ✅ | CX22 | 4GB | 40GB | €4.92 | **€69.04** |
| DigitalOcean | Basic | 1GB | 25GB | $6 (~€5.50) | €76.00 |
| Vultr | Regular | 1GB | 25GB | $6 (~€5.50) | €76.00 |
| Linode | Nanode | 1GB | 25GB | $5 (~€4.58) | €64.96 |
| Oracle Cloud | Free Tier | 1GB | 47GB | FREE | €10 (domain only) |

\* Includes domain (~€10/year), excludes backups

**Hetzner savings vs. DigitalOcean**: €76 - €59.76 = **€16.24/year saved**

### Cost-Saving Tips

1. **Start small, scale for event**: Begin with CX11, upgrade to CX22/CX32 only for wedding month
   - Saves: ~€6-10/year

2. **Use snapshots instead of auto-backups for testing**: Snapshots are cheaper if you don't need weekly backups
   - CX22 snapshot: €0.48/month vs. Auto-backup: €1.97/month
   - Saves: €1.49/month or €17.88/year

3. **Downgrade after wedding**: Keep CX11 for memories/photos after event
   - Saves: €0.77/month or €9.24/year

4. **Delete old snapshots**: Remove snapshots after confirming stability
   - Saves: €0.24-0.48/month each

5. **Annual domain registration**: Some registrars offer discounts for multi-year
   - Cloudflare domains: €9.77/year (cheapest)
   - Namecheap .com: ~€12/year
   - Saves: €2-3/year

### Free vs. Paid Hosting

**Why pay €5/month instead of using Oracle Cloud Free Tier?**

| Factor | Hetzner (€4.15/mo) | Oracle Cloud (Free) |
|--------|---------------------|---------------------|
| **Setup complexity** | Simple, straightforward | Complex, steep learning curve |
| **Console UI** | Excellent, intuitive | Confusing, enterprise-focused |
| **Support** | Good documentation | Limited for free tier |
| **Reliability** | 99.9% uptime guarantee | Free tier has restrictions |
| **Scaling** | Easy (2-3 min downtime) | Difficult, limited resources |
| **Server specs** | 2GB RAM, 2 vCPU, 20GB | 1GB RAM, 1 vCPU, 47GB |
| **Recommendation** | ✅ Best for simplicity | ⚠️ Only if budget is $0 |

**Bottom line**: €5/month (~€60/year) is worth it for peace of mind and ease of use. Your wedding day is not the time to troubleshoot Oracle Cloud VCN security lists!

### Total Cost of Ownership (1 Year)

**Minimal Setup**: €59.76/year (~€5/month)
- Hetzner CX11: €4.15/month × 12 = €49.80
- Domain: €10/year
- SSL: FREE
- No backups, no snapshots

**Recommended Setup**: €92.64/year (~€7.72/month)
- Hetzner CX22: €4.92/month × 12 = €59.04
- Automated backups: €1.97/month × 12 = €23.64
- Domain: €10/year
- SSL: FREE

**Smart Scaling (Best Value)**: €62.54/year (~€5.21/month avg)
- CX11 for 11 months: €45.65
- CX22 for wedding month: €4.92
- Backups for wedding month: €1.97
- Domain: €10/year

---

## 🌐 Alternative Deployment Methods

### Option 1: Cloudflare Tunnel (Zero Trust)

**Benefits:**
- No public IP needed
- No firewall configuration
- Free DDoS protection
- Hides your server IP

**Setup:**
```bash
# Install cloudflared
curl -L https://github.com/cloudflare/cloudflared/releases/latest/download/cloudflared-linux-amd64.deb -o cloudflared.deb
sudo dpkg -i cloudflared.deb

# Login
cloudflared tunnel login

# Create tunnel
cloudflared tunnel create wedding-app

# Configure tunnel
nano ~/.cloudflared/config.yml
```

```yaml
url: http://localhost:80
tunnel: TUNNEL-ID
credentials-file: /home/deploy/.cloudflared/TUNNEL-ID.json
```

```bash
# Route domain
cloudflared tunnel route dns wedding-app yourdomain.com

# Run tunnel
cloudflared tunnel run wedding-app
```

### Option 2: Docker Swarm (High Availability)

For multiple VPS instances with load balancing.

### Option 3: Kubernetes (Overkill but Scalable)

For enterprise-grade deployment with auto-scaling.

---

## 📞 Support & Resources

### Useful Commands Reference

```bash
# Check service status
docker-compose ps
systemctl status docker
systemctl status fail2ban

# View logs
docker-compose logs -f [service]
journalctl -u docker -f
sudo tail -f /var/log/fail2ban.log

# Check ports
sudo netstat -tlnp
sudo lsof -i :80
sudo lsof -i :443

# Test connectivity
curl -I https://yourdomain.com
curl -vI https://yourdomain.com

# Check DNS
dig yourdomain.com
nslookup yourdomain.com

# Firewall
sudo ufw status verbose
sudo ufw allow 8080/tcp
sudo ufw delete allow 8080/tcp

# Docker cleanup
docker-compose down
docker system prune -a
docker volume prune

# Check disk space
df -h
du -sh ~/*

# Memory and CPU
free -h
htop
docker stats
```

### Learning Resources

- **Docker**: https://docs.docker.com/
- **Traefik**: https://doc.traefik.io/traefik/
- **Let's Encrypt**: https://letsencrypt.org/docs/
- **Debian**: https://www.debian.org/doc/

### Community Support

- **GitHub Issues**: Open an issue in your repository
- **Docker Community**: https://forums.docker.com/
- **Traefik Community**: https://community.traefik.io/

---

## 📚 Appendix: Alternative VPS Providers

**Note**: This guide is optimized for **Hetzner Cloud** with detailed, step-by-step instructions for the Hetzner console. If you prefer a different VPS provider, the deployment steps remain the same after server creation, but you'll need to adapt the provider-specific parts (account setup, console navigation, server creation, etc.).

### Quick Comparison

| Provider | Entry Plan | vCPUs | RAM | Storage | Price/Month | Free Trial/Credit | Notes |
|----------|-----------|-------|-----|---------|-------------|-------------------|-------|
| **Hetzner** (This Guide) 🏆 | CX11 | 1 | 2GB | 20GB SSD | **€4.15** | No | Best value, EU servers, easy scaling |
| **DigitalOcean** | Basic | 1 | 1GB | 25GB SSD | $6 (~€5.50) | $200/60 days | Beginner-friendly, good docs |
| **Vultr** | Cloud Compute | 1 | 1GB | 25GB SSD | $6 (~€5.50) | $100 credit | Global locations |
| **Linode (Akamai)** | Nanode | 1 | 1GB | 25GB SSD | $5 (~€4.58) | $100/60 days | Reliable, acquired by Akamai |
| **Oracle Cloud** | Free Tier | 1 | 1GB | 47GB | **FREE** | 2 VMs forever | Complex setup, free forever |
| **Google Cloud** | e2-micro | 2 | 1GB | 10GB | $10 (~€9.17) | $300/90 days | Powerful but overkill |

### Why This Guide Uses Hetzner

- ✅ **Best value**: €4.15/month beats all competitors
- ✅ **Simplicity**: Straightforward console, no hidden complexity
- ✅ **Better specs**: 2GB RAM vs. 1GB on DigitalOcean/Vultr at similar price
- ✅ **EU servers**: GDPR-compliant, excellent European latency (also has US locations)
- ✅ **Easy scaling**: One-click server resize with 2-3 min downtime
- ✅ **Transparent pricing**: No surprise charges, no data transfer fees
- ✅ **Reliability**: 99.9% uptime, established provider since 1997
- ✅ **24TB traffic included**: Most apps never exceed this

**Bottom line**: All VPS providers work with this wedding app. We chose Hetzner for the best combination of price, simplicity, specs, and reliability.

---

### Using DigitalOcean Instead

**Overview**: DigitalOcean is very beginner-friendly with excellent documentation. Good alternative if you prefer a US-based company or want to use free credits.

**Key differences from Hetzner:**
- Server = "**Droplet**" (not "Server")
- Dashboard: https://cloud.digitalocean.com/
- **Lower specs**: 1GB RAM vs. Hetzner's 2GB at similar price
- **Price**: $6/month (~€5.50) vs. Hetzner €4.15/month
- **Free trial**: $200 credit for 60 days (vs. no trial on Hetzner)

**Server creation differences:**
1. **Go to**: DigitalOcean → "Create" → "Droplets"
2. **Choose Region**: Select closest to your guests (similar to Hetzner)
3. **Image**: Debian 12 x64
4. **Droplet Plan**: Basic → Regular
5. **Size**: $6/month (1GB RAM, 25GB SSD) - closest to Hetzner CX11
6. **Authentication**: SSH keys or password (same as Hetzner)
7. **Create Droplet**: Get IP address

**DNS configuration**:
- **Option A**: Use DigitalOcean DNS (Networking → Domains)
- **Option B**: Use external DNS provider (same as in this guide)

**Firewall**:
- **Option A**: DigitalOcean Cloud Firewalls (Networking → Firewalls)
- **Option B**: UFW inside server (same as this guide - already configured by deploy script)

**Backups**:
- **Automated backups**: $1.20/month for $6 droplet (20% of droplet cost)
- **Snapshots**: $0.06/GB/month (more expensive than Hetzner)

**Scaling**:
- Can resize droplets, but more complex than Hetzner
- Requires powering off and may need manual disk resize

**After server creation**: All deployment steps in this guide work exactly the same. Just use your DigitalOcean droplet IP address instead of Hetzner IP.

---

### Using Vultr Instead

**Overview**: Similar to DigitalOcean, with more global locations. Good for international audiences.

**Key differences from Hetzner:**
- Server = "**Cloud Compute Instance**"
- Dashboard: https://my.vultr.com/
- **Global locations**: 25+ locations worldwide (vs. Hetzner's 5)
- **Price**: $6/month (~€5.50) for 1GB RAM
- **Free trial**: $100 credit

**Server creation differences:**
1. **Deploy New Instance** → Cloud Compute
2. **Choose Server**: Regular Performance
3. **Server Location**: Choose from 25+ locations
4. **Server Image**: Debian 12 x64
5. **Server Size**: $6/month (1GB RAM, 25GB SSD)
6. **SSH Keys**: Add SSH key (optional)
7. **Deploy Now**: Get IP address

**DNS configuration**: Vultr DNS available at DNS → Add Domain

**Firewall**: Configure in "Firewall" section or use UFW (this guide's method works)

**Backups**:
- **Automatic backups**: $1.20/month (20% of instance cost)
- **Snapshots**: Free (up to 2 snapshots)

**After server creation**: Use Vultr IP address in place of Hetzner IP. All other steps identical.

---

### Using Linode (Akamai) Instead

**Overview**: Recently acquired by Akamai, known for reliability and good support. Slightly more expensive than Hetzner but still competitive.

**Key differences from Hetzner:**
- Server = "**Linode**"
- Dashboard: https://cloud.linode.com/
- **Now owned by Akamai**: Enterprise backing, global CDN integration
- **Price**: $5/month (~€4.58) for Nanode 1GB
- **Free trial**: $100 credit for 60 days

**Server creation differences:**
1. **Create Linode** button
2. **Choose Distribution**: Debian 12
3. **Region**: Choose closest to guests (11 regions globally)
4. **Linode Plan**: Shared CPU → **Nanode 1GB** ($5/month)
5. **Linode Label**: Name your server
6. **Root Password**: Set password (or add SSH keys)
7. **Create Linode**: Get IP address

**DNS configuration**: Linode Domains (Domains → Add a Domain)

**Firewall**:
- **Linode Cloud Firewall**: Available (free)
- **UFW**: Configured by this guide's deploy script (works fine)

**Backups**:
- **Automated backups**: $2/month for Nanode (40% of plan cost - more expensive than Hetzner)
- **Snapshots**: $0.05/GB/month

**After server creation**: Replace Hetzner IP with Linode IP. All deployment steps work the same.

---

### Using Oracle Cloud Free Tier

**Overview**: Completely FREE forever (2 VMs with 1GB RAM each). Best if budget is $0, but significantly more complex to set up than Hetzner.

**⚠️ Important**: Only recommended if you absolutely cannot afford €5/month. Setup complexity is **much higher** than Hetzner.

**Benefits**:
- ✅ **FREE forever**: 2 VMs, 1GB RAM each, 47GB storage each
- ✅ **No credit card charges**: Never billed (after initial verification)
- ✅ **Always free tier**: Doesn't expire

**Drawbacks**:
- ❌ **Complex signup**: Credit card verification, country restrictions
- ❌ **Confusing UI**: Enterprise-focused, not beginner-friendly
- ❌ **VCN security**: Must configure Virtual Cloud Network security lists (extra firewall layer)
- ❌ **Poor documentation**: Free tier docs are scattered
- ❌ **Account suspension risk**: Free tier accounts sometimes randomly suspended
- ❌ **Lower specs**: 1GB RAM vs. Hetzner's 2GB

**Server creation differences (high-level)**:
1. **Create Oracle Cloud account** (requires credit card verification)
2. **Navigate to**: Compute → Instances → Create Instance
3. **Image**: Canonical Ubuntu or Debian (NOT Oracle Linux)
4. **Shape**: VM.Standard.E2.1.Micro (Always Free)
5. **Networking**: Create VCN → Configure security lists:
   - **Ingress rules**: Ports 22, 80, 443 from 0.0.0.0/0
   - **Egress rules**: All traffic allowed
6. **SSH keys**: Add public key (required)
7. **Create**: Get public IP

**Additional required steps**:
1. **Configure VCN Security Lists**:
   - Networking → Virtual Cloud Networks → Security Lists
   - Add ingress rules for ports 22, 80, 443
2. **Configure instance firewall** (in addition to UFW):
   ```bash
   # After SSH into server
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 80 -j ACCEPT
   sudo iptables -I INPUT 6 -m state --state NEW -p tcp --dport 443 -j ACCEPT
   sudo netfilter-persistent save
   ```

**Why we don't recommend Oracle Cloud Free Tier for weddings**:
- Your wedding day is NOT the time to troubleshoot VCN security lists
- Account suspension risk (rare but documented)
- Complex setup could delay your timeline
- €60/year for Hetzner is worth the peace of mind

**If you still want to use it**: Follow Oracle's "Always Free" tier documentation, then use this guide's deployment steps after server creation. Be prepared to spend 2-3x more time on initial setup.

---

### Using Google Cloud Platform

**Overview**: Most powerful but most expensive and complex. Only use if you need Google Cloud integration or have free credits.

**Key differences**:
- **Price**: ~$10/month for e2-micro (vs. €4.15 for Hetzner)
- **Free tier**: $300 credit for 90 days, then e2-micro is free (with limitations)
- **Complexity**: High - enterprise-grade platform
- **Overkill**: Way more features than needed for a wedding app

**Recommendation**: Not recommended unless you specifically need Google Cloud. Hetzner or DigitalOcean are better choices for this use case.

---

### Migration Between Providers

**If you want to switch from one provider to another**:

**Option 1: Manual migration (recommended)**:
1. Create new server on target provider
2. Run server-setup.sh on new server
3. Clone/transfer app files to new server
4. Copy database file: `scp old-server:~/database/guests.db new-server:~/database/`
5. Run deploy.sh on new server
6. Update DNS to point to new server IP
7. Test thoroughly
8. Delete old server

**Option 2: Snapshot-based migration** (provider-specific):
- Most providers don't support cross-provider snapshot imports
- Would need to manually create image and transfer

---

### Deployment Compatibility Matrix

All steps in this guide work on all providers after server creation:

| Step | Hetzner | DigitalOcean | Vultr | Linode | Oracle | Google Cloud |
|------|---------|--------------|-------|--------|--------|--------------|
| **Server Creation** | Provider-specific | Provider-specific | Provider-specific | Provider-specific | Provider-specific | Provider-specific |
| **DNS Configuration** | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| **Server Hardening** | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ⚠️ Need extra firewall | ⚠️ Need extra firewall |
| **Docker Installation** | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| **App Deployment** | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ✅ Same |
| **SSL Certificate** | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ✅ Same | ✅ Same |

**Bottom line**: After you have a Debian 12 server with a public IP, the deployment process is **identical across all providers**.

---

### Final Recommendation

**For this wedding invitation app, we recommend**:

1. **🥇 Hetzner CX22** (€4.92/month) - Best overall choice
   - Best value, good specs, easy to use, detailed guide above

2. **🥈 Hetzner CX11** (€4.15/month) - Budget option
   - Cheapest reliable option, may struggle with high traffic

3. **🥉 DigitalOcean Basic** ($6/month) - If you have credits
   - Good if you have $200 free credit, but more expensive long-term

4. **Linode Nanode** ($5/month) - If you prefer Akamai
   - Slightly more expensive than Hetzner, but good alternative

5. **Oracle Cloud Free Tier** (FREE) - Only if budget is truly $0
   - FREE but complex setup, not recommended for time-sensitive projects

**Avoid for this use case**: Google Cloud (overkill and expensive), AWS (even more overkill)

---

## 🎉 Congratulations!

Your wedding invitation app is now live on the internet! 🌐

**Next Steps:**
1. ✅ Share the link with your guests
2. 📧 Test email notifications (if configured)
3. 📱 Test on mobile devices
4. 🔒 Verify RSVP and comment functionality
5. 📊 Monitor visitor analytics (if added)

**Access your app at:**
- 🌐 **https://yourdomain.com**

Enjoy your special day! 💒✨

---

**Need help?** Check the [Troubleshooting](#-troubleshooting) section or open an issue on GitHub.