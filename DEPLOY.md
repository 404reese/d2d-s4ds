# Simple CI/CD Setup for Flask Backend on EC2

## 🚀 Quick Setup Guide

### 1. EC2 Setup (Run these commands on your EC2 server)

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install required packages
sudo apt install -y python3 python3-pip python3-venv nginx git

# Clone your repo
cd /home/ubuntu
git clone https://github.com/your-username/d2d-s4ds.git
cd d2d-s4ds/flask-be

# Setup Python environment
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env with your settings: nano .env

# Setup database
python -c "from app import app, db; app.app_context().push(); db.create_all()"
```

### 2. Configure Services

```bash
# Copy service file
sudo cp /home/ubuntu/d2d-s4ds/deployment/flask-blog.service /etc/systemd/system/

# Copy nginx config
sudo cp /home/ubuntu/d2d-s4ds/deployment/nginx-flask-blog /etc/nginx/sites-available/
sudo ln -s /etc/nginx/sites-available/nginx-flask-blog /etc/nginx/sites-enabled/
sudo rm /etc/nginx/sites-enabled/default

# Start services
sudo systemctl daemon-reload
sudo systemctl enable flask-blog
sudo systemctl start flask-blog
sudo systemctl restart nginx
```

### 3. GitHub Secrets (Add in GitHub repo settings → Secrets)

```
EC2_HOST = your-ec2-ip-address
EC2_SSH_KEY = your-private-ssh-key
```

### 4. Test Everything

```bash
# Check services
sudo systemctl status flask-blog
sudo systemctl status nginx

# Test API
curl http://localhost
curl http://your-ec2-ip
```

## 📝 Useful Commands

```bash
# View logs
sudo journalctl -u flask-blog -f

# Restart services
sudo systemctl restart flask-blog
sudo systemctl restart nginx

# Deploy manually
cd /home/ubuntu/d2d-s4ds
git pull origin main
cd flask-be
source venv/bin/activate
pip install -r requirements.txt
sudo systemctl restart flask-blog
```

## 🔄 How CI/CD Works

1. Push code to `main` branch
2. GitHub Actions connects to EC2
3. Pulls latest code
4. Installs dependencies
5. Restarts services
6. Done! ✅

That's it! Super simple setup.