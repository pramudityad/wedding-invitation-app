#!/bin/bash

# ============================================
# VPS Server Hardening Script for Debian
# ============================================
# This script sets up a new Debian VPS with:
# - Non-root user with sudo privileges
# - SSH key authentication
# - Firewall (UFW) configuration
# - Fail2ban for brute-force protection
# - Automatic security updates
# ============================================

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
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

# Check if running as root
if [ "$EUID" -ne 0 ]; then
    print_error "This script must be run as root"
    exit 1
fi

print_info "Starting VPS server setup and hardening..."

# ============================================
# 1. Update System
# ============================================
print_info "Updating system packages..."
apt update
apt upgrade -y

# ============================================
# 2. Set Timezone
# ============================================
print_info "Setting timezone..."
echo "Current timezone: $(timedatectl | grep "Time zone")"
read -p "Do you want to change timezone? (y/n): " change_tz
if [ "$change_tz" = "y" ]; then
    timedatectl list-timezones
    read -p "Enter timezone (e.g., Asia/Jakarta): " timezone
    timedatectl set-timezone "$timezone"
    print_info "Timezone set to $timezone"
fi

# ============================================
# 3. Create Non-Root User
# ============================================
read -p "Enter username for new user (default: deploy): " username
username=${username:-deploy}

if id "$username" &>/dev/null; then
    print_warning "User $username already exists. Skipping user creation."
else
    print_info "Creating user: $username"
    adduser --gecos "" "$username"
    usermod -aG sudo "$username"
    print_info "User $username created and added to sudo group"
fi

# ============================================
# 4. Setup SSH Key Authentication
# ============================================
print_info "Setting up SSH key authentication..."
user_home=$(eval echo ~"$username")
ssh_dir="$user_home/.ssh"

mkdir -p "$ssh_dir"

read -p "Do you want to add an SSH public key now? (y/n): " add_key
if [ "$add_key" = "y" ]; then
    echo "Paste your SSH public key (from ~/.ssh/id_rsa.pub on your local machine):"
    read ssh_key
    echo "$ssh_key" >> "$ssh_dir/authorized_keys"
    print_info "SSH key added to $ssh_dir/authorized_keys"
else
    print_warning "Remember to add your SSH key to $ssh_dir/authorized_keys before disabling password authentication!"
fi

# Set correct permissions
chmod 700 "$ssh_dir"
chmod 600 "$ssh_dir/authorized_keys" 2>/dev/null || true
chown -R "$username:$username" "$ssh_dir"

# ============================================
# 5. Configure SSH Security
# ============================================
print_info "Configuring SSH security..."
cp /etc/ssh/sshd_config /etc/ssh/sshd_config.backup

# Disable root login
sed -i 's/^#*PermitRootLogin.*/PermitRootLogin no/' /etc/ssh/sshd_config

# Disable password authentication (only if SSH key is added)
if [ "$add_key" = "y" ]; then
    read -p "Disable password authentication? (recommended if SSH key is working) (y/n): " disable_password
    if [ "$disable_password" = "y" ]; then
        sed -i 's/^#*PasswordAuthentication.*/PasswordAuthentication no/' /etc/ssh/sshd_config
        print_info "Password authentication disabled"
    fi
fi

# Other SSH hardening
sed -i 's/^#*PubkeyAuthentication.*/PubkeyAuthentication yes/' /etc/ssh/sshd_config
sed -i 's/^#*ChallengeResponseAuthentication.*/ChallengeResponseAuthentication no/' /etc/ssh/sshd_config

# Restart SSH service
systemctl restart sshd
print_info "SSH configuration updated and service restarted"

# ============================================
# 6. Setup UFW Firewall
# ============================================
print_info "Setting up UFW firewall..."
apt install -y ufw

# Default policies
ufw default deny incoming
ufw default allow outgoing

# Allow SSH (change port if you use custom SSH port)
ufw allow 22/tcp

# Allow HTTP and HTTPS
ufw allow 80/tcp
ufw allow 443/tcp

# Enable UFW
print_info "Enabling UFW firewall..."
echo "y" | ufw enable

ufw status verbose
print_info "Firewall configured and enabled"

# ============================================
# 7. Install and Configure Fail2ban
# ============================================
print_info "Installing Fail2ban..."
apt install -y fail2ban

# Create custom jail configuration
cat > /etc/fail2ban/jail.local <<EOF
[DEFAULT]
bantime = 3600
findtime = 600
maxretry = 5
destemail = root@localhost
sendername = Fail2Ban
action = %(action_mw)s

[sshd]
enabled = true
port = 22
logpath = %(sshd_log)s
backend = %(sshd_backend)s
EOF

systemctl enable fail2ban
systemctl restart fail2ban
print_info "Fail2ban installed and configured"

# ============================================
# 8. Setup Automatic Security Updates
# ============================================
print_info "Setting up automatic security updates..."
apt install -y unattended-upgrades apt-listchanges

# Configure automatic updates
cat > /etc/apt/apt.conf.d/50unattended-upgrades <<EOF
Unattended-Upgrade::Allowed-Origins {
    "\${distro_id}:\${distro_codename}";
    "\${distro_id}:\${distro_codename}-security";
    "\${distro_id}ESMApps:\${distro_codename}-apps-security";
    "\${distro_id}ESM:\${distro_codename}-infra-security";
};
Unattended-Upgrade::AutoFixInterruptedDpkg "true";
Unattended-Upgrade::MinimalSteps "true";
Unattended-Upgrade::Remove-Unused-Kernel-Packages "true";
Unattended-Upgrade::Remove-Unused-Dependencies "true";
Unattended-Upgrade::Automatic-Reboot "false";
Unattended-Upgrade::Automatic-Reboot-Time "02:00";
EOF

cat > /etc/apt/apt.conf.d/20auto-upgrades <<EOF
APT::Periodic::Update-Package-Lists "1";
APT::Periodic::Download-Upgradeable-Packages "1";
APT::Periodic::AutocleanInterval "7";
APT::Periodic::Unattended-Upgrade "1";
EOF

print_info "Automatic security updates enabled"

# ============================================
# 9. Install Essential Tools
# ============================================
print_info "Installing essential tools..."
apt install -y \
    curl \
    wget \
    git \
    vim \
    htop \
    net-tools \
    ca-certificates \
    gnupg \
    lsb-release

# ============================================
# 10. Setup Swap (if not exists)
# ============================================
if [ ! -f /swapfile ]; then
    print_info "Creating swap file (2GB)..."
    fallocate -l 2G /swapfile
    chmod 600 /swapfile
    mkswap /swapfile
    swapon /swapfile
    echo '/swapfile none swap sw 0 0' >> /etc/fstab
    print_info "Swap file created and enabled"
else
    print_warning "Swap file already exists. Skipping."
fi

# ============================================
# Summary
# ============================================
echo ""
echo "============================================"
print_info "Server setup completed successfully!"
echo "============================================"
echo ""
echo "Summary of changes:"
echo "  ✓ System updated"
echo "  ✓ User '$username' created with sudo privileges"
echo "  ✓ SSH key authentication configured"
echo "  ✓ SSH hardened (root login disabled)"
echo "  ✓ UFW firewall enabled (ports 22, 80, 443)"
echo "  ✓ Fail2ban installed and configured"
echo "  ✓ Automatic security updates enabled"
echo "  ✓ Essential tools installed"
echo "  ✓ Swap file configured (2GB)"
echo ""
print_warning "IMPORTANT NEXT STEPS:"
echo "  1. Test SSH login as '$username' from another terminal"
echo "  2. Make sure you can use sudo as '$username'"
echo "  3. Once confirmed, you can close this root session"
echo "  4. Run the Docker installation script as '$username'"
echo ""
print_info "To install Docker, run: curl -fsSL https://get.docker.com | sh"
print_info "Then add user to docker group: sudo usermod -aG docker $username"
echo ""