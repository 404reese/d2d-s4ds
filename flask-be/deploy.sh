#!/bin/bash

# Flask Backend Deployment Script for EC2
# Run this script on your EC2 instance to deploy the backend

set -e  # Exit on any error

echo "🚀 Starting Flask Backend Deployment..."

# Check if running as root (not recommended for production)
if [ "$EUID" -eq 0 ]; then
    echo "⚠️  Warning: Running as root. Consider using a non-root user for security."
fi

# Update system packages
echo "📦 Updating system packages..."
sudo yum update -y

# Install Python 3 and pip if not installed
if ! command -v python3 &> /dev/null; then
    echo "🐍 Installing Python 3..."
    sudo yum install python3 python3-pip -y
fi

# Install git if not installed
if ! command -v git &> /dev/null; then
    echo "📥 Installing Git..."
    sudo yum install git -y
fi

# Create application directory
APP_DIR="/home/ec2-user/flask-blog"
mkdir -p $APP_DIR
cd $APP_DIR

# Clone repository (update with your repo URL)
echo "📁 Cloning repository..."
if [ -d ".git" ]; then
    echo "Repository already exists, pulling latest changes..."
    git pull origin main
else
    echo "Please run: git clone <your-repo-url> ."
    echo "Then run this script again."
    exit 1
fi

# Navigate to flask backend
cd flask-be

# Create virtual environment
echo "🐍 Creating virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install Python dependencies
echo "📦 Installing Python dependencies..."
pip install --upgrade pip
pip install -r requirements.txt

# Create .env file if it doesn't exist
if [ ! -f ".env" ]; then
    echo "⚙️  Creating .env file..."
    cp .env.example .env
    echo ""
    echo "🔧 IMPORTANT: Edit the .env file with your actual values:"
    echo "   nano .env"
    echo ""
    echo "Make sure to set:"
    echo "   - FRONTEND_URL (your Amplify URL)"
    echo "   - BACKEND_URL (this EC2 instance URL)"
    echo "   - SECRET_KEY (generate a secure random key)"
    echo "   - ADMIN_TOKEN (generate a secure token)"
    echo "   - AWS S3 credentials"
    echo "   - Email configuration"
    echo ""
    read -p "Press Enter after you've edited the .env file..."
fi

# Create systemd service file
echo "🔧 Creating systemd service..."
sudo tee /etc/systemd/system/flask-blog.service > /dev/null <<EOF
[Unit]
Description=Flask Blog Application
After=network.target

[Service]
Type=simple
User=ec2-user
WorkingDirectory=$APP_DIR/flask-be
Environment=PATH=$APP_DIR/flask-be/venv/bin
ExecStart=$APP_DIR/flask-be/venv/bin/python app.py
Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
EOF

# Reload systemd and start service
echo "🚀 Starting Flask application service..."
sudo systemctl daemon-reload
sudo systemctl enable flask-blog
sudo systemctl start flask-blog

# Check service status
sleep 2
if sudo systemctl is-active --quiet flask-blog; then
    echo "✅ Flask application is running!"
    
    # Get EC2 public IP
    PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
    
    echo ""
    echo "🌐 Your Flask backend is accessible at:"
    echo "   http://$PUBLIC_IP:5000"
    echo ""
    echo "🔍 Health check:"
    echo "   curl http://$PUBLIC_IP:5000/api/health"
    echo ""
    echo "📊 Check service status:"
    echo "   sudo systemctl status flask-blog"
    echo ""
    echo "📝 View logs:"
    echo "   sudo journalctl -u flask-blog -f"
    echo ""
    echo "⚠️  Security reminder:"
    echo "   - Ensure port 5000 is open in your EC2 security group"
    echo "   - Update VITE_API_URL in your Amplify environment to: http://$PUBLIC_IP:5000"
    
else
    echo "❌ Failed to start Flask application!"
    echo "Check logs with: sudo journalctl -u flask-blog -f"
    exit 1
fi

echo ""
echo "✨ Deployment complete!"
