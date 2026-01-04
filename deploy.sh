#!/bin/bash

# ============================================
# Wedding Invitation App - Deployment Script
# ============================================
# This script automates the deployment process:
# - Validates environment configuration
# - Checks Docker installation
# - Creates necessary directories
# - Builds and starts containers
# - Verifies deployment
# ============================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Functions
print_info() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

print_step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

# Banner
echo "============================================"
echo "  Wedding Invitation App - Deployment"
echo "============================================"
echo ""

# ============================================
# 1. Check if running as root
# ============================================
if [ "$EUID" -eq 0 ]; then
    print_warning "Running as root. It's recommended to run as a non-root user with Docker privileges."
    read -p "Continue anyway? (y/n): " continue_root
    if [ "$continue_root" != "y" ]; then
        exit 1
    fi
fi

# ============================================
# 2. Check Docker Installation
# ============================================
print_step "Checking Docker installation..."
if ! command -v docker &> /dev/null; then
    print_error "Docker is not installed!"
    echo "Install Docker with: curl -fsSL https://get.docker.com | sh"
    exit 1
fi
print_success "Docker is installed ($(docker --version))"

# Check Docker Compose
if ! command -v docker-compose &> /dev/null && ! docker compose version &> /dev/null; then
    print_error "Docker Compose is not installed!"
    echo "Install Docker Compose with: sudo apt install docker-compose-plugin"
    exit 1
fi
print_success "Docker Compose is installed"

# Check if user can run Docker
if ! docker ps &> /dev/null; then
    print_error "Cannot run Docker commands. Add your user to docker group:"
    echo "  sudo usermod -aG docker $USER"
    echo "  Then log out and log back in"
    exit 1
fi
print_success "Docker permissions OK"

# ============================================
# 3. Check .env File
# ============================================
print_step "Checking environment configuration..."
if [ ! -f .env ]; then
    print_error ".env file not found!"
    echo ""
    echo "Please create .env file from template:"
    echo "  cp .env.example .env"
    echo "  nano .env"
    echo ""
    exit 1
fi
print_success ".env file found"

# Source .env file
set -a
source .env
set +a

# Validate required variables
required_vars=("DOMAIN" "ADMIN_API_KEY" "JWT_SECRET")
missing_vars=()

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ] || [ "${!var}" = "example.com" ] || [ "${!var}" = "your_secret_key" ] || [[ "${!var}" == "your-"* ]] || [[ "${!var}" == "your_"* ]]; then
        missing_vars+=("$var")
    fi
done

if [ ${#missing_vars[@]} -gt 0 ]; then
    print_error "Please configure these variables in .env:"
    for var in "${missing_vars[@]}"; do
        echo "  - $var"
    done
    echo ""
    echo "Edit with: nano .env"
    exit 1
fi
print_success "Environment variables validated"

# ============================================
# 4. Check traefik.yml Email
# ============================================
print_step "Checking Traefik configuration..."
if grep -q "your-email@example.com" traefik.yml; then
    print_error "Please update email in traefik.yml for Let's Encrypt notifications"
    echo "Edit with: nano traefik.yml"
    echo "Find and replace: your-email@example.com"
    exit 1
fi
print_success "Traefik configuration OK"

# ============================================
# 5. Check DNS Configuration
# ============================================
print_step "Checking DNS configuration for domain: $DOMAIN"
server_ip=$(curl -s ifconfig.me)
domain_ip=$(dig +short "$DOMAIN" | tail -n1)

print_info "Server IP: $server_ip"
print_info "Domain IP: $domain_ip"

if [ "$server_ip" != "$domain_ip" ]; then
    print_warning "Domain $DOMAIN does not point to this server!"
    echo "  Expected: $server_ip"
    echo "  Got: $domain_ip"
    echo ""
    echo "Please update your DNS A record to point to $server_ip"
    read -p "Continue anyway? (y/n): " continue_dns
    if [ "$continue_dns" != "y" ]; then
        exit 1
    fi
else
    print_success "DNS is correctly configured"
fi

# ============================================
# 6. Create Required Directories
# ============================================
print_step "Creating required directories..."
mkdir -p letsencrypt
mkdir -p database
mkdir -p data
print_success "Directories created"

# ============================================
# 7. Check if containers are already running
# ============================================
print_step "Checking for existing containers..."
if docker-compose ps | grep -q "Up"; then
    print_warning "Containers are already running"
    read -p "Stop and rebuild? (y/n): " rebuild
    if [ "$rebuild" = "y" ]; then
        print_info "Stopping containers..."
        docker-compose down
    else
        print_info "Keeping existing containers running"
        exit 0
    fi
fi

# ============================================
# 8. Build and Start Containers
# ============================================
print_step "Building Docker images..."
docker-compose build --no-cache

print_step "Starting containers..."
docker-compose up -d

# Wait for containers to start
print_info "Waiting for containers to start..."
sleep 5

# ============================================
# 9. Verify Containers
# ============================================
print_step "Verifying containers..."
if ! docker-compose ps | grep -q "Up"; then
    print_error "Containers failed to start!"
    echo ""
    echo "Check logs with: docker-compose logs"
    exit 1
fi
print_success "All containers are running"

# Display container status
docker-compose ps

# ============================================
# 10. Wait for SSL Certificate
# ============================================
print_step "Waiting for SSL certificate generation..."
print_info "This may take 1-2 minutes..."

for i in {1..60}; do
    if docker-compose logs traefik 2>/dev/null | grep -q "Certificate obtained"; then
        print_success "SSL certificate obtained!"
        break
    fi
    if [ $i -eq 60 ]; then
        print_warning "SSL certificate not detected after 60 seconds"
        print_info "Check logs with: docker-compose logs traefik"
    fi
    sleep 2
done

# ============================================
# 11. Display Access Information
# ============================================
echo ""
echo "============================================"
print_success "Deployment completed successfully!"
echo "============================================"
echo ""
echo "Your wedding invitation app is now accessible at:"
echo "  🌐 https://$DOMAIN"
echo "  🌐 https://www.$DOMAIN"
echo ""
echo "Traefik Dashboard:"
echo "  📊 http://$server_ip:8081/dashboard/"
echo "  📊 https://traefik.$DOMAIN (if configured)"
echo ""
echo "Useful commands:"
echo "  View logs:           docker-compose logs -f"
echo "  View Traefik logs:   docker-compose logs -f traefik"
echo "  View backend logs:   docker-compose logs -f backend"
echo "  View frontend logs:  docker-compose logs -f frontend"
echo "  Restart services:    docker-compose restart"
echo "  Stop services:       docker-compose down"
echo "  Update app:          git pull && docker-compose up -d --build"
echo ""
print_info "It may take a few minutes for DNS changes to propagate fully"
echo ""

# ============================================
# 12. Check SSL Certificate
# ============================================
read -p "Test SSL certificate now? (y/n): " test_ssl
if [ "$test_ssl" = "y" ]; then
    print_info "Testing SSL certificate..."
    sleep 5
    if curl -sI "https://$DOMAIN" | grep -q "HTTP/2 200"; then
        print_success "HTTPS is working correctly!"
    else
        print_warning "HTTPS test failed. Check logs: docker-compose logs traefik"
    fi
fi

echo ""
print_success "🎉 Your wedding invitation app is live! Share the link with your guests!"
echo ""